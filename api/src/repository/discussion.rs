use async_trait::async_trait;
use core_services::db::builder::Repository;
use core_services::services::base::Resolve;
use schema::devlog::devblog::entities::{Discussion, DiscussionId, PostId};

#[async_trait]
pub trait DiscussionRepository: Repository<Discussion, DiscussionId> {
    async fn count_discussion(&self, post: &PostId) -> Resolve<i32>;
    async fn get_discussions(&self, post: &PostId, start: i32, limit: i32) -> Resolve<Vec<Discussion>>;
}
