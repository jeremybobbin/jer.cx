#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde;
#[macro_use] extern crate serde_derive;
extern crate database;

mod video;
mod cors;

use crate::video::Video;
use crate::cors::CORS;

use rocket_contrib::{
    serve::StaticFiles,
    json::Json,
};

use rocket::{
    http::{
        ContentType,
    },
    request::{
        Request,
    },
    response::{
        self,
        Redirect,
        NamedFile,
        Stream,
        Responder,
        Response
    },
};

use database::*;

use std::{
    path::Path,
    path::PathBuf,
    net::SocketAddr,
    net::TcpListener,
    collections::HashMap,
    thread,
    time::{
        SystemTime,
        Duration,
        UNIX_EPOCH,
    },
    io::{
        self,
        Write,
        Cursor,
        BufReader,
    },
    fs::{
        self,
        File,
    },
    ffi::OsString,
};


#[database("site")]
struct DbConn(PgConnection);

fn serve_react(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    match database::insert_ip(&*conn, socket) {
        Ok(reason) => println!("DB Success: {:?}", {}),
        Err(reason) => println!("DB Error: {}", reason),
    }

    NamedFile::open("assets/react/index.html").ok()
}

#[get("/")]
fn index(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/about")]
fn about(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/links")]
fn links(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/video")]
fn video(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/video/<path..>")]
fn video_stream(path: PathBuf) -> Option<Video> {

    let path = Path::new("assets/private/video")
        .join(path);

    File::open(path).ok()
        .map(|f| Video(f))
}

#[get("/videos")]
fn videos() -> Option<Json<Vec<String>>> {
    let path = Path::new("assets/private/video");

    let mut entries = fs::read_dir(&path).ok()?;

    let videos: Vec<String> = entries.filter_map(Result::ok)
        .map(|e| e.file_name())
        .map(|e| e.into_string())
        .filter_map(Result::ok)
        .collect();

    Some(Json(videos))
}

#[derive(Serialize)]
struct Post {
    name: String,
    modified: u64,
}

#[get("/posts")]
fn posts() -> Option<Json<Vec<Post>>> {
    let path = Path::new("assets/posts");

    let mut posts = fs::read_dir(&path).ok()?
        .filter_map(Result::ok)
        .filter_map(|e| {
            let name = e.file_name()
                .into_string();

            let modified = e.metadata()
                .and_then(|md| md.modified())
                .map(|t| t.duration_since(UNIX_EPOCH).map(|d| d.as_secs()));
            
            if let (Ok(name), Ok(Ok(modified))) = (name, modified) {
                Some(Post { name, modified })
            } else {
                None
            }
        })
        .collect();

    Some(Json(posts))
}

#[get("/posts/<name..>")]
fn posts_by_name(name: PathBuf) -> Option<NamedFile> {
    let mut path = Path::new("assets/posts");

    NamedFile::open(path.join(name)).ok()
}

#[get("/<path>")]
fn public(path: String) -> Option<NamedFile> {
    let file_name = Path::new("assets/public")
        .join(&path);

    NamedFile::open(file_name).ok()
}

#[catch(404)]
fn not_found() -> Redirect {
    Redirect::to("/")
}

const HTTP_302: &'static str = "HTTP/1.1 302 Found\r\n";
const URL: &'static str =      "https://www.jer.cx/";

fn main() {
    // Redirect HTTP to HTTPs.
    thread::spawn(move || {
        let res = format!("{}Location: {}\r\n", HTTP_302, URL)
            .into_bytes();

        let listener = TcpListener::bind("0.0.0.0:8080")
            .expect("Could not listen on port 8080.");

        let streams = listener
            .incoming()
            .filter_map(Result::ok);

        for mut stream in streams {
            stream.write(&res);
        }
    });

    let routes = routes![index, video, videos, video_stream, posts, public, links, about, posts_by_name];

    rocket::ignite()
        .mount("/", routes)
        .mount("/react", StaticFiles::from("assets/react"))
        .register(catchers![not_found])
        .attach(CORS())
        .attach(DbConn::fairing())
        .launch();
}

