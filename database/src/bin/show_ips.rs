extern crate database;
extern crate diesel;

use self::diesel::prelude::*;
use self::models;
use self::database::*;

fn main() {
    use database::schema::hashed_ips::dsl::*;
    let conn = establish_connection();

    let ips = show_ips(&conn)
        .expect("Could not query DB.");

    for ip in ips {
        println!("{}", ip.hashed_ip);
    }
}
