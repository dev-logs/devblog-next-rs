use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::{devlog::{devblog::entities::{Discussion, PostId}, entities::{User, UserId}}, misc::datetime::Datetime};
use surreal_derive_plus::surreal_quote;
use surrealdb::sql::{Array, Value};
use surrealdb_id::relation::r#trait::IntoRelation;

use super::DiscussionService;

#[derive(Debug, Clone)]
pub struct NewDiscussionParams<'a> {
    pub discussion: &'a Discussion,
    pub post_id: &'a PostId,
    pub user: &'a User
}

impl <'a> Service<NewDiscussionParams<'a>, Discussion> for DiscussionService {
    async fn execute(self, params: NewDiscussionParams<'a>) -> Resolve<Discussion> {
        let sender_id: UserId = UserId { email: params.user.email.clone() };
        let post_id: &PostId = params.post_id;

        // let found_post: Option<Post> = self.db.query(surreal_quote!("SELECT * FROM #val(&post_id)")).await?.take(0)?;
        // if found_post.is_none() {
        //     return Err(Errors::NotFound("Post does not exist".to_owned()));
        // }

        let mut new_discussion = params.discussion.clone();
        let created_at = Datetime {
           utc_millis_since_epoch: chrono::Utc::now().timestamp_millis() as i64
        };

        new_discussion.created_at = Some(created_at);

        let discussion_relation = new_discussion.relate(sender_id, post_id);
        let created_discussion: Value = self.db.query(surreal_quote!("SELECT * FROM (#relate(&discussion_relation)) FETCH out")).await?.take(0)?;
        let created_discussion: Discussion = created_discussion.into();
        return Ok(created_discussion);
    }
}
