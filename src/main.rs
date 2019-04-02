#![feature(proc_macro_hygiene)]
#![feature(decl_macro)]

#[macro_use]
extern crate rocket;
extern crate rocket_contrib;


use rocket_contrib::serve::StaticFiles;
use rocket::fairing::AdHoc;
use rocket::response::Redirect;
use rocket::config::{
    self,
    Environment,
    Config,
    ConfigBuilder,
};

fn get_conf(conf: ConfigBuilder) -> config::Result<Config> {
    conf
        .address("127.0.0.1")
        .port(8080)
        .finalize()
}


fn rocket() -> rocket::Rocket {
    // Bear with me ...
    // No 'Environment::Global'
    let conf = if let Ok(c) = get_conf(Config::build(Environment::Development)) {
        c
    } else if let Ok(c) = get_conf(Config::build(Environment::Staging)) {
        c
    } else {
        get_conf(Config::build(Environment::Production))
            .unwrap()
    };
    rocket::custom(conf) 
        .mount("/", StaticFiles::from("/www/public"))
}

fn main() {
    rocket().launch();
}
