use rocket_contrib::{
    json::Json,
};

use rocket::{
    http::RawStr,
    response::NamedFile,
};

use std::{
    path::Path,
    path::PathBuf,
    time::UNIX_EPOCH,
    fs
};

#[derive(Serialize)]
pub struct Post {
    name: String,
    modified: u64,
}

#[get("/posts")]
pub fn posts() -> Option<Json<Vec<Post>>> {
    let path = Path::new("assets/posts");

    let posts = fs::read_dir(&path).ok()?
        .filter_map(Result::ok)
        .filter_map(|e| {
            let path = e.path();
            // Get file stem to remove '.md'
            let name = path.file_stem()
                .map(|stem| stem.to_os_string())
                .map(|os_str| os_str.into_string())?;

            let modified = e.metadata()
                .and_then(|md| md.modified())
                .map(|t| t.duration_since(UNIX_EPOCH).map(|d| d.as_secs()));
            
            if let (Ok(name), Ok(Ok(modified))) = (name, modified) {
                Some(Post { name, modified })
            } else {
                None
            }
        })
        .collect();

    Some(Json(posts))
}

#[get("/posts/<name>")]
pub fn posts_by_name(name: String) -> Result<NamedFile, String> {
    let name: String = name.chars()
        .map(|c| {
            if c == '_' {
                ' '
            } else {
                c
            }
        }).collect();
    let post = PathBuf::from(format!("assets/posts/{}.md", &name));
    NamedFile::open(&post)
        .map_err(|_err| format!("Could not find post: '{:?}'", name))
}
