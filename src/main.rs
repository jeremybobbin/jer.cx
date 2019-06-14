#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate diesel;

extern crate sha3;
use sha3::{Digest, Sha3_256};

use rocket_contrib::serve::StaticFiles;

use rocket::{
    http::RawStr,
    outcome::Outcome,
    response::{
        Redirect,
        NamedFile,
    },
};

use std::{
    path::Path,
    net::SocketAddr,
};

use diesel::prelude::*;

use schema::hashed_ips::{
    self,
    dsl::*
};

use crate::{
    models::*,
    db::*,
};

mod models;
mod db;
mod schema;

#[database("site")]
struct DbConn(diesel::MysqlConnection);

// Hashes IP to put into DB. Should to be placed with data access logic
#[get("/")]
fn index(conn: DbConn, sock: SocketAddr) -> Option<NamedFile> {
    let mut hasher = Sha3_256::new();
    let ip = sock.ip();

    hasher.input(ip.to_string());

    let result = hasher.result();
    let ip = String::from_utf8_lossy(&result);

    let new_ip = new_ip {
        hashed_ip: &ip
    };
 
    let db_res = diesel::insert_into(hashed_ips::table)
        .values(&new_ip)
        .execute(&*conn);

    match db_res {
        Ok(reason) => println!("DB Success: {:?}", {}),
        Err(reason) => println!("DB Error: {}", reason),
    }

    NamedFile::open(Path::new("public/react/index.html")).ok()
}

#[catch(404)]
fn not_found() -> Redirect {
    Redirect::to("/")
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index])
        .mount("/public", StaticFiles::from("public"))
        .register(catchers![not_found])
        .attach(DbConn::fairing())
        .launch();
}
