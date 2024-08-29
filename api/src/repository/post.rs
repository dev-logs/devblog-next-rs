use core_services::services::base::Resolve;
use schema::devlog::devblog::entities::{Post, PostId};

#[async_trait::async_trait]
pub trait PostRepository: Send + Sync {
    async fn get_post(&self, post_id: &PostId) -> Resolve<Option<Post>>; 
}
