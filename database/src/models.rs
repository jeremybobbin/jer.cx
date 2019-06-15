use super::schema::hashed_ips;

#[derive(Queryable)]
pub struct IP {
    pub id: i32,
    pub hashed_ip: String,
}

#[derive(Insertable)]
#[table_name="hashed_ips"]
pub struct NewIP<'a> {
    pub hashed_ip: &'a str,
}
