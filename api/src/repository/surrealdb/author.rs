use core_services::db::builder::SurrealDbRepository;
use core_services::db::{SurrealDbConnection, SurrealDbConnectionInfo};
use core_services::utils::pool::reponse::PoolResponse;
use core_services::utils::pool::request::PoolRequest;
use schema::devlog::devblog::entities::{Author, AuthorId};

use crate::repository::author::AuthorRepository;

pub struct AuthorSurrealDbRepository {
    pub db: PoolRequest<SurrealDbConnection>
}

#[async_trait::async_trait]
impl SurrealDbRepository<Author, AuthorId> for AuthorSurrealDbRepository {
    async fn get_db(&self) -> PoolResponse<SurrealDbConnection> {
        self.db.retreive().await.unwrap()
    }
}

#[async_trait::async_trait]
impl AuthorRepository for AuthorSurrealDbRepository {}
