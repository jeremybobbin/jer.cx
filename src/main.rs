#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;
extern crate sha3;
use sha3::{Digest, Sha3_256};



mod models;
mod db;
mod schema;


use crate::models::*;
use crate::db::*;
use diesel::prelude::*;
use schema::hashed_ips;
use schema::hashed_ips::dsl::*;
use rocket_contrib::serve::StaticFiles;
use rocket::{
    http::{
    },
    fairing::{
        Fairing,
        Kind,
        Info
    },
    config::{
        self,
        Environment,
        Config,
        ConfigBuilder,
    },
    outcome::Outcome,
    response::Redirect,
    request,
    Request,
    Response,
    State,
    Data
};

use std::{
    sync::{
        Arc,
        Mutex
    },
    ops::{
        Deref,
        DerefMut
    }
};

#[database("site")]
struct DbConn(diesel::MysqlConnection);


struct Views {
}

impl Views {
    fn add(conn: &diesel::MysqlConnection, ip: String) -> Result<usize, diesel::result::Error> {
        let mut hasher = Sha3_256::new();
        hasher.input(ip);
        let result = hasher.result();

        let ip = &String::from_utf8_lossy(&result).to_string();

        let new_ip = new_ip {
            hashed_ip: ip

        };

        diesel::insert_into(hashed_ips::table)
            .values(&new_ip)
            .execute(conn)
    }
}

impl Fairing for Views {
    // This is a request and response fairing named "GET/POST Counter".
    fn info(&self) -> Info {
        Info {
            name: "Unique View Counter",
            kind: Kind::Request
        }
    }

    // Increment the counter for `GET` and `POST` requests.
    fn on_request(&self, req: &mut Request, _: &Data) {
        let ip = match req.client_ip() {
            Some(ip) => ip.to_string(),
            None => return
        };
        println!("{}", ip);
        let conn = match req.guard::<DbConn>() {
            Outcome::Success(c) => c,
            Outcome::Failure(_)=> return,
            Outcome::Forward(_) => return,
        };

        match Views::add(&conn, ip) {
            Ok(a) => {
                println!("Ok!");
                println!("{:?}", a);
            },
            Err(a) => {
                println!("Dang!");
                println!("{:?}", a);

            },

        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
    }
}


fn rocket() -> rocket::Rocket {
    // Bear with me ...
    // No 'Environment::Global'
    rocket::ignite()
        .mount("/", StaticFiles::from("public"))
}

fn main() {
    let v = Views {};
    rocket()
        .attach(v)
        .attach(DbConn::fairing())
        .launch();
}
