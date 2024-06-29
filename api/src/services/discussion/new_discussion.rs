use core_services::services::{base::{Resolve, Service}, errors::Errors};
use core_services::Db;
use schema::devlog::{devblog::entities::{Discussion, Post}, entities::User, links};
use schema::devlog::devblog::links as devblog_links;
use surreal_derive_plus::surreal_quote;
use surrealdb_id::relation::r#trait::IntoRelation;

pub struct CreateDiscussionServiceImpl {
    pub db: Db
}

impl <'a> Service<&'a Discussion, Discussion> for CreateDiscussionServiceImpl {
    async fn execute(self, discussion: &'a Discussion) -> Resolve<Discussion> {
        let sender_link = discussion.user.as_ref().expect("Sender must be difined").link.as_ref().unwrap();
        let post_link = discussion.post.as_ref().expect("Post id must be defined").link.as_ref().unwrap();

        let mut user_db: Option<User> = None;
        let user = match sender_link {
            links::user_link::Link::UserId(user_id) => {
                let found_user: Option<User> = self.db.query(surreal_quote!("SELECT * FROM #val(&user_id)")).await?.take(0)?;
                if found_user.is_none() {
                    return Err(Errors::UnAuthorized("User does not exist".to_owned()));
                }

                user_db = Some(found_user.unwrap());
                user_db.as_ref().unwrap()
            },
            links::user_link::Link::User(user) => user
        };

        let mut post_db: Option<Post> = None;
        let post = match post_link {
            devblog_links::post_link::Link::PostId(user_id) => {
                let found_post: Option<Post> = self.db.query(surreal_quote!("SELECT * FROM #val(&user_id)")).await?.take(0)?;
                if found_post.is_none() {
                    return Err(Errors::UnAuthorized("User does not exist".to_owned()));
                }

                post_db = Some(found_post.unwrap());
                post_db.as_ref().unwrap()
            },
            devblog_links::post_link::Link::Post(post) => post
        };

        let relation = discussion.clone().relate(user, post);
        let created_discussion: Option<Discussion> = self.db.query("#relate(&relation)").await?.take(0)?;
        Ok(created_discussion.unwrap())
    }
}
