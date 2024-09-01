use core_services::{db::builder::Repository, services::base::Resolve};
use schema::devlog::devblog::entities::{Author, AuthorId};

#[async_trait::async_trait]
pub trait AuthorRepository: Repository<Author, AuthorId> {
}

