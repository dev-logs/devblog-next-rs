use core_services::{db::{builder::SurrealDbRepository, SurrealDbConnection, SurrealDbConnectionInfo}, utils::pool::{reponse::PoolResponse, request::PoolRequest}};
use schema::devlog::devblog::entities::{Author, AuthorId};

use crate::repository::author::AuthorRepository;

pub struct AuthorSurrealDbRepository {
    pub db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>
}

#[async_trait::async_trait]
impl SurrealDbRepository<Author, AuthorId> for AuthorSurrealDbRepository {
    async fn get_db(&self) -> PoolResponse<SurrealDbConnection, SurrealDbConnectionInfo> {
        self.db.retreive().await.unwrap()
    }
}

#[async_trait::async_trait]
impl AuthorRepository for AuthorSurrealDbRepository {}

