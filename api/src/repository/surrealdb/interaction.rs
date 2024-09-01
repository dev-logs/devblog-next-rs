use core_services::{db::{trusted::{DbIntent, TrustedOne}, SurrealDbConnection, SurrealDbConnectionInfo}, services::base::Resolve, utils::pool::request::PoolRequest};
use schema::devlog::{devblog::entities::PostId, entities::{Like, UserId, View, Vote}};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::{QlPath, SurrealQR};
use surrealdb_id::relation::r#trait::IntoRelation;

use crate::repository::interactive::InteractionRepository;

pub struct InteractionSurrealDb {
    pub db: PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>
}

#[async_trait::async_trait]
impl InteractionRepository for InteractionSurrealDb {
    async fn create_view_post(&self, user: &UserId, post: &PostId, view: View) -> Resolve<View> {
        let view = DbIntent::New(view);
        let db = self.db.retreive().await.expect("Database must be connected");
        let relation = view.relate(user, post);
        let view: TrustedOne = db.query(surreal_quote!(r#"SELECT * FROM #relate(&relation)"#)).await?.take(0)?;
        let view: Option<View> = view.into();

        Ok(view.expect("The like action must be returned successfully after inserted to db"))
    }

    async fn create_like_post(&self, user: &UserId, post: &PostId, like: Like) -> Resolve<Like> {
        let like = DbIntent::New(like);
        let relation = like.relate(user, post);
        let db = self.db.retreive().await.expect("Database must be connected");
        let like: TrustedOne = db.query(surreal_quote!(r#"SELECT * FROM #relate(&relation)"#)).await?.take(0)?;
        let like: Option<Like> = like.into();

        Ok(like.expect("The like action must be returned successfully after inserted to db"))
    }

    async fn create_vote_post(&self, user: &UserId, post: &PostId, vote: Vote) -> Resolve<Vote> {
        let vote = DbIntent::New(vote);
        let relation = vote.relate(user, post);
        let db = self.db.retreive().await.expect("Database must be connected");
        let vote: TrustedOne = db.query(surreal_quote!(r#"SELECT * FROM #relate(&relation)"#)).await?.take(0)?;
        let vote: Option<Vote> = vote.into();

        Ok(vote.expect("The like action must be returned successfully after inserted to db"))
    }

    async fn count_like(&self, post: &PostId) -> Resolve<i32> {
        let db = self.db.retreive().await.expect("Database must be connected successfully");
        let result: TrustedOne = db.query(surreal_quote!(r##"
            SELECT out, math::sum(count) as total_count 
            FROM #id(post)<-like 
            WHERE deleted_at = nil 
            GROUP BY out
        "##)).await?.take(0)?;

        let result: SurrealQR = result.into();
        Ok(result.get(QlPath::Field("total_count"))?.as_i64()? as i32)
    }

    async fn count_view(&self, post: &PostId) -> Resolve<i32> {
        let db = self.db.retreive().await.expect("Database must be connected successfully");
        let result: TrustedOne = db.query(surreal_quote!(r##"
            SELECT out, math::sum(count) as total_count 
            FROM #id(post)<-view
            WHERE deleted_at = nil
            GROUP BY out
        "##)).await?.take(0)?;

        let result: SurrealQR = result.into();
        Ok(result.get(QlPath::Field("total_count"))?.as_i64()? as i32)
    }

    async fn count_vote(&self, post: &PostId) -> Resolve<i32> {
        let db = self.db.retreive().await.expect("Database must be connected successfully");
        let result: TrustedOne = db.query(surreal_quote!(r##"
            SELECT out, math::sum(count) as total_count 
            FROM #id(post)<-vote
            WHERE deleted_at = nil
            GROUP BY out
        "##)).await?.take(0)?;

        let result: SurrealQR = result.into();
        Ok(result.get(QlPath::Field("total_count"))?.as_i64()? as i32)
    }
}

