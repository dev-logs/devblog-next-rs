use core_services::{db::{SurrealDbConnection, SurrealDbConnectionInfo}, services::base::Resolve, utils::pool::request::PoolRequest};
use schema::devlog::devblog::entities::{Post, PostId};
use surreal_derive_plus::surreal_quote;

use crate::repository::post::PostRepository;

pub struct PostSurrealDbRepository {
    pub db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>
}

#[async_trait::async_trait]
impl PostRepository for PostSurrealDbRepository {
    async fn get_post(&self, post_id: &PostId) -> Resolve<Option<Post>> {
        let db = self.db.retreive().await.expect("Surrealdb connection failed");
        let post: Option<Post> = db.query(surreal_quote!("SELECT * FROM #id(&post_id)")).await?.take(0)?;
        Ok(post)
    }
}

