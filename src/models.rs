use crate::schema::hashed_ips;

#[derive(Queryable)]
pub struct hashed_ip {
    pub id: u32,
    pub hashed_ip: String,
}

#[derive(Insertable)]
#[table_name="hashed_ips"]
pub struct new_ip<'a> {
    pub hashed_ip: &'a str,
}
