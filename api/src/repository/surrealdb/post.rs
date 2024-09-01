use core_services::{db::{builder::SurrealDbRepository, trusted::TrustedOne, SurrealDbConnection, SurrealDbConnectionInfo}, services::base::Resolve, utils::pool::{allocator::PoolResource, reponse::PoolResponse, request::PoolRequest}};
use schema::devlog::devblog::entities::{Post, PostId};
use surreal_derive_plus::surreal_quote;

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

