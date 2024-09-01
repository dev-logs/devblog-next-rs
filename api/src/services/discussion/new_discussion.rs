use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::{devlog::devblog::entities::{Discussion, Post}, misc::datetime::Datetime};
use async_trait::async_trait;

use super::{DiscussionService, NewDiscussionParams};

#[async_trait]
impl <'a> Service<NewDiscussionParams<'a>, Discussion> for DiscussionService {
    async fn execute(&self, params: NewDiscussionParams<'a>) -> Resolve<Discussion> {
        let found_post: Option<Post> = self.post_repository.get(&params.post_id).await?;
        if found_post.is_none() {
            return Err(Errors::ResourceNotFound("Post does not exist".to_owned()));
        }

        let mut new_discussion = params.discussion.clone();
        let created_at = Datetime {
           utc_millis_since_epoch: chrono::Utc::now().timestamp_millis() as u64
        };

        new_discussion.created_at = Some(created_at);

        let created_discussion = self.discussion_repository.create(&new_discussion).await?;

        return Ok(created_discussion);
    }
}

