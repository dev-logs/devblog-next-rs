use core_services::{db::{builder::SurrealDbRepository, SurrealDbConnection, SurrealDbConnectionInfo}, utils::pool::{reponse::PoolResponse, request::PoolRequest}};
use schema::devlog::devblog::entities::{Post, PostId};

use crate::repository::post::PostRepository;

pub struct PostSurrealDbRepository {
    pub db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>
}

#[async_trait::async_trait]
impl SurrealDbRepository<Post, PostId> for PostSurrealDbRepository {
    async fn get_db(&self) -> PoolResponse<SurrealDbConnection, SurrealDbConnectionInfo> {
        self.db.retreive().await.unwrap()
    }
}

#[async_trait::async_trait]
impl PostRepository for PostSurrealDbRepository {
}

