use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::{devlog::{devblog::entities::{Discussion, Post, PostId}, entities::{User, UserId}}, misc::datetime::Datetime};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::SurrealQR;
use surrealdb_id::relation::r#trait::IntoRelation;
use async_trait::async_trait;

use super::{DiscussionService, NewDiscussionParams};

#[async_trait]
impl <'a> Service<NewDiscussionParams<'a>, Discussion> for DiscussionService {
    async fn execute(&self, params: NewDiscussionParams<'a>) -> Resolve<Discussion> {
        let sender_id: UserId = UserId { email: params.user.email.clone() };
        let post_id: &PostId = params.post_id;

        let found_post: Option<Post> = self.post_repository.get_post(&params.post_id);
        if found_post.is_none() {
            return Err(Errors::ResourceNotFound("Post does not exist".to_owned()));
        }

        let mut new_discussion = params.discussion.clone();
        let created_at = Datetime {
           utc_millis_since_epoch: chrono::Utc::now().timestamp_millis() as u64
        };

        new_discussion.created_at = Some(created_at);

        let created_discussion = self.discussion_repository.new_discussion(discussion, sender_id, found_post.unwrap().into()).await?;

        return Ok(created_discussion);
    }
}

