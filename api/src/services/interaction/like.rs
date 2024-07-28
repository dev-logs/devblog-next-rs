use core_services::{
    services::{base::{Resolve, Service}, errors::Errors},
    Db,
};
use log::info;
use schema::{
    devlog::{
        devblog::entities::PostId,
        entities::{Like, User},
    },
    misc::datetime::Datetime,
};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::{QlPath, SurrealQR};
use surrealdb_id::relation::r#trait::IntoRelation;

#[derive(Debug)]
pub struct PostInteractionService {
    pub db: Db,
}

#[derive(Debug, Clone)]
pub enum Interaction {
    Like(Like),
}

#[derive(Clone, Debug)]
pub struct PostInteractionParams {
    pub user: User,
    pub post_id: PostId,
    pub interaction: Interaction,
}

#[derive(Clone, Debug)]
pub enum PostInteractionResult {
    Like(i32)
}

impl Service<PostInteractionParams, PostInteractionResult> for PostInteractionService {
    async fn execute(self, params: PostInteractionParams) -> Resolve<PostInteractionResult> {
        let result = match params.interaction {
            Interaction::Like(action) => {
                if action.count < 1 {
                    return Err(Errors::BadRequest("Like count must be positive number".to_owned()))
                }

                let post_like = Like {
                    count: action.count,
                    created_at: Some(Datetime::now()),
                };

                let relation = post_like.relate(&params.user, &params.post_id);
                self.db.query(surreal_quote!(r#"#relate(&relation)"#)).await?;

                let result: SurrealQR = self.db.query(surreal_quote!("SELECT out, math::sum(count) as total_count from #id(&params.post_id)<-like GROUP BY out")).await?.take(0)?;
                let total_likes: i32 = result.get(QlPath::Field("total_count"))?.as_i64()? as i32;

                PostInteractionResult::Like(total_likes)
            }
        };

        Ok(result)
    }
}
