use async_trait::async_trait;
use core_services::services::base::{Resolve, Service};
use core_services::services::errors::Errors;
use schema::devlog::devblog::entities::{Discussion, Post};
use schema::misc::datetime::Datetime;
use schema::surrealdb::links::{post_link, user_link, PostLink, UserLink};

use super::{DiscussionService, NewDiscussionParams};

#[async_trait]
impl<'a> Service<NewDiscussionParams<'a>, Discussion> for DiscussionService {
    async fn execute(&self, params: NewDiscussionParams<'a>) -> Resolve<Discussion> {
        let found_post: Option<Post> = self.post_repository.get(&params.post_id).await?;
        if found_post.is_none() {
            return Err(Errors::ResourceNotFound("Post does not exist".to_owned()));
        }

        let mut new_discussion = params.discussion.clone();
        new_discussion.user = Some(UserLink {
            link: Some(user_link::Link::Object(params.user.clone()))
        });

        new_discussion.post = Some(PostLink {
            link: Some(post_link::Link::Id(params.post_id.clone()))
        });

        let created_at = Datetime {
            utc_millis_since_epoch: chrono::Utc::now().timestamp_millis() as u64
        };

        new_discussion.created_at = Some(created_at);

        let created_discussion = self.discussion_repository.create(&new_discussion).await?;

        return Ok(created_discussion);
    }
}
