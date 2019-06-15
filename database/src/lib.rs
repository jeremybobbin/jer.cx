#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate sha3;

use sha3::{Digest, Sha3_256};
use dotenv::dotenv;

use diesel::prelude::*;
use diesel::result::QueryResult;
pub use diesel::pg::PgConnection;

use self::models::*;

use std::{
    net::SocketAddr,
    env,
};

pub mod models;
pub mod schema;

pub fn establish_connection() -> PgConnection {
    dotenv();

    let database_url: String = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    PgConnection::establish(&database_url)
        .expect("Error connecting to database")
}

pub fn insert_ip(conn: &PgConnection, socket: SocketAddr) -> QueryResult<usize> {
    use schema::hashed_ips::dsl::*;

    let mut hasher = Sha3_256::new();
    let ip = socket.ip();

    hasher.input(ip.to_string());

    let result = hasher.result();
    let ip = String::from_utf8_lossy(&result);

    let new_ip = NewIP {
        hashed_ip: &ip
    };
 
    diesel::insert_into(hashed_ips)
        .values(&new_ip)
        .execute(conn)
}

pub fn show_ips(conn: &PgConnection) -> QueryResult<Vec<IP>> {
    use schema::hashed_ips::dsl::*;
 
    hashed_ips.limit(5)
        .load::<IP>(conn)
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
