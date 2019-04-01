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
        .address("45.77.215.144")
        .port(80)
        .finalize()
}

#[get("/<alt>")]
fn uni_redirect(alt: String) -> Option<Redirect> {
    if alt == "resume.pdf" {
         Some(Redirect::to("/"))
    } else {
        None
    }
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
        .mount("/", routes![uni_redirect])
        .mount("/", StaticFiles::from("/www/public"))
}

fn main() {
    rocket().launch();
}
