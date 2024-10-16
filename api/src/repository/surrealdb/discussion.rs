use core_services::db::builder::SurrealDbRepository;
use core_services::db::trusted::{DbIntent, TrustedOne};
use core_services::db::{SurrealDbConnection, SurrealDbConnectionInfo};
use core_services::services::base::Resolve;
use core_services::services::errors::Errors;
use core_services::utils::pool::reponse::PoolResponse;
use core_services::utils::pool::request::PoolRequest;
use schema::devlog::devblog::entities::{Discussion, DiscussionId, PostId};
use schema::devlog::entities::UserId;
use schema::surrealdb::links::{post_link, user_link};
use surreal_derive_plus::surreal_quote;
use surrealdb_id::relation::r#trait::IntoRelation;

use crate::repository::discussion::DiscussionRepository;

pub struct DiscussionSurrealDbRepository {
    pub(crate) db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>
}

#[async_trait::async_trait]
impl SurrealDbRepository<Discussion, DiscussionId> for DiscussionSurrealDbRepository {
    async fn get_db(&self) -> PoolResponse<SurrealDbConnection, SurrealDbConnectionInfo> {
        self.db.retreive().await.unwrap()
    }

    async fn create(&self, discussion: &Discussion) -> Resolve<Discussion> {
        let user_id = match discussion.user.as_ref().map(|it| it.link.as_ref().unwrap()) {
            Some(user_link::Link::Id(id)) => id.clone(),
            Some(user_link::Link::Object(obj)) => UserId {
                email: obj.email.clone()
            },
            _ => panic!("Expected user_id to create discussion")
        };

        let post_id = match discussion.post.as_ref().map(|it| it.link.as_ref().unwrap()) {
            Some(post_link::Link::Id(id)) => id.clone(),
            Some(post_link::Link::Object(obj)) => PostId {
                title: obj.title.clone()
            },
            _ => panic!("Expected user_id to create discussion")
        };

        let db = self.db.retreive().await.expect("Failed to connect to db");
        let discussion_relation = DbIntent::New(discussion.relate(user_id, post_id));
        let created_discussion: TrustedOne =
            db.query(surreal_quote!("SELECT * FROM (#relate(&discussion_relation)) FETCH out")).await?.take(0)?;
        let created_discussion: Option<Discussion> = created_discussion.into();
        if None == created_discussion.as_ref() {
            return Err(Errors::DatabaseError {
                message: "Failed to insert into db".to_string(),
                db_name: "surrealdb".to_string()
            });
        }

        Ok(created_discussion.unwrap())
    }
}

#[async_trait::async_trait]
impl DiscussionRepository for DiscussionSurrealDbRepository {
    async fn get_discussions(&self, post_id: &PostId, start: i32, limit: i32) -> Resolve<Vec<Discussion>> {
        let db = self.db.retreive().await.expect("Failed to connect db");
        let result: TrustedOne = db
            .query(surreal_quote!(
                r##"
                SELECT *
                FROM #id(post_id)<-discussion
                ORDER BY created_at
                DESC START #start
                LIMIT #limit
                FETCH user"##
            ))
            .await?
            .take(0)?;

        Ok(result.into())
    }

    async fn count_discussion(&self, post_id: &PostId) -> Resolve<i32> {
        let db = self.db.retreive().await.expect("Failed to connect to db");
        let total_count: Option<i32> = db
            .query(surreal_quote!("SELECT count() from #id(post_id)<-discussion group all"))
            .await?
            .take((0, "count"))?;
        let total_count = total_count.unwrap_or(0);
        Ok(total_count)
    }
}
