use core_services::{db::builder::Repository, services::base::Resolve};
use schema::devlog::{devblog::entities::{Discussion, DiscussionId, Post, PostId}, entities::UserId, rpc::Paging};
use async_trait::async_trait;

#[async_trait]
pub trait DiscussionRepository: Repository<Discussion, DiscussionId> {
    async fn count_discussion(&self, post: &PostId) -> Resolve<i32>;
    async fn get_discussions(&self, post: &PostId, start: i32, limit: i32) -> Resolve<Vec<Discussion>>;
}
