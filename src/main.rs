#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
extern crate database;

use rocket_contrib::serve::StaticFiles;

use rocket::{
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
};


#[database("site")]
struct DbConn(PgConnection);

// Hashes IP to put into DB. Should to be placed with data access logic
#[get("/")]
fn index(conn: DbConn, socket: SocketAddr) -> Option<NamedFile> {

    match database::insert_ip(&*conn, socket) {
        Ok(reason) => println!("DB Success: {:?}", {}),
        Err(reason) => println!("DB Error: {}", reason),
    }

    NamedFile::open("assets/react/index.html").ok()
}

#[get("/video/<path..>")]
fn video(path: PathBuf) -> Option<NamedFile> {

    let path = Path::new("assets/private/video")
        .join(path);

    NamedFile::open(path).ok()
}



#[catch(404)]
fn not_found() -> Redirect {
    Redirect::to("/")
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, video])
        .mount("/public", StaticFiles::from("assets/public"))
        .mount("/react", StaticFiles::from("assets/react"))
        .register(catchers![not_found])
        .attach(DbConn::fairing())
        .launch();
}
