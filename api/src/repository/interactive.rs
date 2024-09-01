use core_services::services::base::Resolve;
use schema::devlog::{devblog::entities::PostId, entities::{Like, UserId}};
use schema::devlog::entities::{View, Vote};

#[async_trait::async_trait]
pub trait InteractionRepository {
    async fn create_view_post(&self, user: &UserId, post: &PostId, view: View) -> Resolve<View>;
    async fn create_like_post(&self, user: &UserId, post: &PostId, like: Like) -> Resolve<Like>;
    async fn create_vote_post(&self, user: &UserId, post: &PostId, vote: Vote) -> Resolve<Vote>;
    async fn count_view(&self, post: &PostId) -> Resolve<i32>;
    async fn count_like(&self, post: &PostId) -> Resolve<i32>;
    async fn count_vote(&self, post: &PostId) -> Resolve<i32>;
} 
