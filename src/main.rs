#![feature(proc_macro_hygiene, decl_macro)]

extern crate serde;
extern crate database;
#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;

mod video;
mod cors;
mod paste_id;
mod posts;

use crate::{
    video::*,
    cors::CORS,
    paste_id::PasteID,
    posts::*,
};

use rocket_contrib::serve::StaticFiles;

use rocket::{
    Data,
    config::{
        ConfigBuilder,
        Environment,
    },
    response::{
        Redirect,
        NamedFile,
    },
};

use database::*;

use std::{
    path::Path,
    path::PathBuf,
    net::SocketAddr,
    thread,
    io,
};


#[database("site")]
struct DbConn(PgConnection);

fn serve_react(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    match database::insert_ip(&*conn, socket) {
        Ok(_) => println!("DB Success: {:?}", {}),
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

#[get("/videos")]
fn videos(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/blog")]
fn blog(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/videos/<_path..>")]
fn videos_sub(conn: DbConn, socket: SocketAddr, _path: PathBuf) -> Option<NamedFile> {
    serve_react(conn, socket)
}

#[get("/blog/<_path..>")]
fn blog_sub(conn: DbConn, socket: SocketAddr, _path: PathBuf) -> Option<NamedFile> {
    serve_react(conn, socket)
}



// Frontend end; api begin



#[post("/pasta?<ext>", data = "<data>")]
fn posta(data: Data, ext: Option<String>) -> io::Result<String> {
    let ext = ext.unwrap_or("".to_string());
    let name = PasteID::new(3, &ext);

    let file = format!("assets/pasta/{}", name);

    data.stream_to_file(file)?;
    Ok(name.to_string())
}

#[get("/pasta/<name..>")]
fn pasta(name: PathBuf) -> Option<NamedFile> {
    let path = Path::new("assets/pasta");
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

#[get("/")]
fn to_https() -> Redirect {
    Redirect::moved("https://www.jer.cx/")
}

#[get("/<path..>")]
fn to_https_sub(path: Option<PathBuf>) -> Redirect {
    if let Some(path) = path {
        println!("Request to HTTP: {:?}", path);
    }
    Redirect::moved("https://www.jer.cx/")
}

fn main() {
    // Redirect HTTP to HTTPs.
    thread::spawn(move || {
        let mut conf = ConfigBuilder::new(Environment::Production)
            .address("0.0.0.0")
            .port(8080);

        conf.tls = None;

        let conf = conf.finalize()
            .expect("Could not finalize http rocket instance");

        rocket::custom(conf)
            .mount("/", routes![to_https, to_https_sub]) 
            .launch();

    });

    let routes = routes![
        about,
        blog,
        blog_sub,
        index,
        links,
        pasta,
        posta,
        posts,
        posts_by_name,
        public,
        video,
        video_stream,
        videos,
        videos_sub,

    ];

    rocket::ignite()
        .mount("/", routes)
        .mount("/react", StaticFiles::from("assets/react"))
        .register(catchers![not_found])
        .attach(CORS())
        .attach(DbConn::fairing())
        .launch();
}

