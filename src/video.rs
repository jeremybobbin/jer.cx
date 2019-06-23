use std::fs::File;
use std::io::{self, Cursor, BufReader};
use std::fmt;
use std::str::FromStr;

use rocket::{
    http::{Status, ContentType, StatusClass, Method},
    http::hyper::header::{AcceptRanges, Range, RangeUnit},
    response::{self, Response, Body, Responder},
    request::Request,
};

pub struct Video(pub File);

impl<'r> Responder<'r> for Video {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        let (metadata, file) = (self.0.metadata(), BufReader::new(self.0));
        match metadata {
            Ok(_) => {
                let mut response = RangeResponder(file).respond_to(req)?;
                response.set_header(ContentType::MP4);
                Ok(response)
            }
            Err(_) => Response::build().streamed_body(file).ok()
        }
    }
}

pub struct RangeResponder<B: io::Seek + io::Read>(pub B);

impl<'r, B: io::Seek + io::Read + 'r> Responder<'r> for RangeResponder<B> {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        use rocket::http::hyper::header::{ContentRange, ByteRangeSpec, ContentRangeSpec};

        let mut body = self.0;
        //  A server MUST ignore a Range header field received with a request method other than GET.
        if req.method() == Method::Get {
            let range = req.headers().get_one("Range").map(|x| Range::from_str(x));
            match range {
                Some(Ok(Range::Bytes(ranges))) => {
                    if ranges.len() == 1 {
                        let size = body.seek(io::SeekFrom::End(0))
                            .expect("Attempted to retrieve size by seeking, but failed.");

                        let (start, end) = match ranges[0] {
                            ByteRangeSpec::FromTo(start, mut end) => {
                                // make end exclusive
                                end += 1;
                                if end > size {
                                    end = size;
                                }
                                (start, end)
                            },
                            ByteRangeSpec::AllFrom(start) => {
                                (start, size)
                            },
                            ByteRangeSpec::Last(len) => {
                                // we could seek to SeekFrom::End(-len), but if we reach a value < 0, that is an error.
                                // but the RFC reads:
                                //      If the selected representation is shorter than the specified
                                //      suffix-length, the entire representation is used.
                                let start = size.checked_sub(len).unwrap_or(0);
                                (start, size)
                            }
                        };

                        if start > size {
                            return Response::build()
                                .status(Status::RangeNotSatisfiable)
                                .header(AcceptRanges(vec![RangeUnit::Bytes]))
                                .ok()
                        }

                        body.seek(io::SeekFrom::Start(start))
                            .expect("Attempted to seek to the start of the requested range, but failed.");

                        return Response::build()
                            .status(Status::PartialContent)
                            .header(AcceptRanges(vec![RangeUnit::Bytes]))
                            .header(ContentRange(ContentRangeSpec::Bytes {
                                // make end inclusive again
                                range: Some((start, end - 1)),
                                instance_length: Some(size),
                            }))
                            .raw_body(Body::Sized(body, end - start))
                            .ok()
                    }
                    // A server MAY ignore the Range header field.
                },
                // An origin server MUST ignore a Range header field that contains a
                // range unit it does not understand.
                Some(Ok(Range::Unregistered(_, _))) => {},
                Some(Err(_)) => {
                    // Malformed
                    return Response::build()
                        .status(Status::RangeNotSatisfiable)
                        .header(AcceptRanges(vec![RangeUnit::Bytes]))
                        .ok()
                }
                None => {},
            };
        }

        Response::build()
            .header(AcceptRanges(vec![RangeUnit::Bytes]))
            .sized_body(body)
            .ok()
    }
}
