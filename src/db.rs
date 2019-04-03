
use diesel::prelude::*;
use diesel::mysql::MysqlConnection;
use std::env;

pub fn establish_connection() -> MysqlConnection {
    let database_url = "mysql://jer@localhost/site";
    MysqlConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
