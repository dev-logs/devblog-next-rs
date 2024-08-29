use core_services::services::base::Resolve;
use schema::devlog::{devblog::entities::{Discussion, Post, PostId}, rpc::Paging, entities::UserId};
use async_trait::async_trait;

#[async_trait]
pub trait DiscussionRepository: Send + Sync {
    async fn count_discussion(&self, post: &PostId) -> Resolve<i32>;
    async fn get_discussions(&self, post: &PostId, start: i32, limit: i32) -> Resolve<Vec<Discussion>>;
    async fn new_discussion(&self, discussion: Discussion, user: UserId, post: PostId) -> Resolve<Discussion>;
}
