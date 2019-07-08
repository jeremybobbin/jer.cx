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

// React Routes
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

fn serve_react(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {
    match database::insert_ip(&*conn, socket) {
        Ok(_) => println!("DB Success: {:?}", {}),
        Err(reason) => println!("DB Error: {}", reason),
    }

    NamedFile::open("assets/react/index.html").ok()
}


// Paste bin... 
// POST /pasta?png 
// returns => https://www.jer.cx/pasta/8sPo2aaE1.png


#[post("/pasta?<ext>", data = "<data>")]
fn posta(data: Data, ext: Option<String>) -> io::Result<String> {
    let ext = ext.unwrap_or("".to_string());
    let name = PasteID::new(3, &ext);

    let file = format!("assets/pasta/{}", name);

    data.stream_to_file(file)?;
    Ok(name.to_string())
}

#[get("/pasta/<name..>")]
fn pasta(name: PathBuf, sock: SocketAddr) -> Option<NamedFile> {
    eprintln!("IP: {} - viewed {}", sock.ip(), name.display());
    let path = Path::new("assets/pasta");
    NamedFile::open(path.join(name)).ok()
}


// Resume routes

#[get("/resume.pdf")]
fn resume_pdf() -> Redirect {
    Redirect::moved("/public/resume.pdf")
}

#[get("/resume")]
fn resume(sock: SocketAddr) -> Option<NamedFile> {
    eprintln!("Request to /resume.html from IP: {}", sock.ip());
    NamedFile::open("assets/public/resume.html").ok()
}

#[get("/resume.html")]
fn resume_html(sock: SocketAddr) -> Redirect {
    resume_redirect(sock)
}

#[get("/resume.htm")]
fn resume_htm(sock: SocketAddr) -> Redirect {
    resume_redirect(sock)
}

fn resume_redirect(sock: SocketAddr) -> Redirect {
    Redirect::to("/resume")
}

// Misc Media

#[get("/linkedin")]
fn linkedin(sock: SocketAddr) -> Redirect {
    Redirect::to("https://www.linkedin.com/in/jeremybobbin")
}

#[get("/github")]
fn github(sock: SocketAddr) -> Redirect {
    Redirect::to("https://www.github.com/jeremybobbin")
}


// Favicon.ico
#[get("/favicon.ico")]
fn favicon() -> Option<NamedFile> {
    NamedFile::open("assets/react/favicon.ico").ok()
}


// Port 80 routes
#[get("/")]
fn to_https() -> Redirect {
    Redirect::moved("https://www.jer.cx/")
}

#[get("/<path..>")]
fn to_https_sub(path: PathBuf) -> Redirect {
    let display = path.display();
    eprintln!("HTTP Request to: {}", display);
    Redirect::moved(format!("https://www.jer.cx/{}", display))
}



// Catchers
#[catch(404)]
fn not_found() -> Redirect {
    Redirect::to("/")
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

    let mut routes = routes![
        about,
        blog,
        blog_sub,
        index,
        links,
        pasta,
        posta,
        posts,
        posts_by_name,
        video,
        video_stream,
        videos,
        videos_sub,

        favicon,

        resume,
        resume_htm,
        resume_html,
        resume_pdf,
        linkedin,
        github,
    ];

    rocket::ignite()
        .mount("/", routes)
        .mount("/react", StaticFiles::from("assets/react"))
        .mount("/public", StaticFiles::from("assets/public"))
        .register(catchers![not_found])
        .attach(CORS())
        .attach(DbConn::fairing())
        .launch();
}

