use core_services::db::builder::Repository;
use schema::devlog::devblog::entities::{Post, PostId};

#[async_trait::async_trait]
pub trait PostRepository: Repository<Post, PostId> {}
