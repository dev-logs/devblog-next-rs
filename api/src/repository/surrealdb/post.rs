use core_services::db::builder::SurrealDbRepository;
use core_services::db::{SurrealDbConnection, SurrealDbConnectionInfo};
use core_services::utils::pool::reponse::PoolResponse;
use core_services::utils::pool::request::PoolRequest;
use schema::devlog::devblog::entities::{Post, PostId};

use crate::repository::post::PostRepository;

pub struct PostSurrealDbRepository {
    pub db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo,>,
}

#[async_trait::async_trait]
impl SurrealDbRepository<Post, PostId,> for PostSurrealDbRepository {
    async fn get_db(&self,) -> PoolResponse<SurrealDbConnection, SurrealDbConnectionInfo,> {
        self.db.retreive().await.unwrap()
    }
}

#[async_trait::async_trait]
impl PostRepository for PostSurrealDbRepository {}
