use rocket_contrib::{
    json::Json,
};

use rocket::{
    response::{
        NamedFile,
    },
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
            let name = e.file_name()
                .into_string();

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

#[get("/posts/<name..>")]
pub fn posts_by_name(name: PathBuf) -> Result<NamedFile, String> {
    let path = Path::new("assets/posts");
    let post = path.join(&name);
    NamedFile::open(&post)
        .map_err(|_err| format!("Could not find post: '{:?}'", name))
}

