use git2::{Cred, RemoteCallbacks, Repository, Signature, IndexAddOption};
use std::path::Path;

#[tauri::command]
pub fn git_init(path: String) -> Result<String, String> {
    match Repository::init(Path::new(&path)) {
        Ok(_) => Ok("Repository initialized".into()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn git_commit(
    path: String,
    message: String,
    name: String,
    email: String,
) -> Result<String, String> {
    let repo = Repository::open(Path::new(&path)).map_err(|e| e.to_string())?;
    let mut index = repo.index().map_err(|e| e.to_string())?;
    
    index.add_all(["*"].iter(), IndexAddOption::DEFAULT, None).map_err(|e| e.to_string())?;
    index.write().map_err(|e| e.to_string())?;
    
    let tree_id = index.write_tree().map_err(|e| e.to_string())?;
    let tree = repo.find_tree(tree_id).map_err(|e| e.to_string())?;
    
    let sig = Signature::now(&name, &email).map_err(|e| e.to_string())?;
    
    let parent_commit = match repo.head() {
        Ok(head) => Some(head.peel_to_commit().map_err(|e| e.to_string())?),
        Err(_) => None,
    };

    let parents = match &parent_commit {
        Some(c) => vec![c],
        None => vec![],
    };

    repo.commit(
        Some("HEAD"),
        &sig,
        &sig,
        &message,
        &tree,
        &parents,
    ).map_err(|e| e.to_string())?;

    Ok("Committed successfully".into())
}

#[tauri::command]
pub fn git_push(path: String, url: String) -> Result<String, String> {
    let repo = Repository::open(Path::new(&path)).map_err(|e| e.to_string())?;
    let mut remote = repo.remote_anonymous(&url).map_err(|e| e.to_string())?;

    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
        Cred::ssh_key_from_agent(username_from_url.unwrap_or("git"))
    });

    let mut push_options = git2::PushOptions::new();
    push_options.remote_callbacks(callbacks);

    remote.push(&["refs/heads/main:refs/heads/main"], Some(&mut push_options))
        .map_err(|e| e.to_string())?;

    Ok("Pushed successfully".into())
}
