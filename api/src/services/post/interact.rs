use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::{
    devlog::entities::{Like, View, Vote},
    misc::datetime::Datetime,
};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::{QlPath, SurrealQR};
use surrealdb_id::relation::r#trait::IntoRelation;

use super::{Interaction, PostInteractionParams, PostInteractionResult, PostService};

impl Service<PostInteractionParams, PostInteractionResult> for PostService {
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

                let result: SurrealQR = self.db.query(surreal_quote!(r##"
                    SELECT out, math::sum(count) as total_count 
                    FROM #id(&params.post_id)<-like 
                    GROUP BY out
                "##)).await?.take(0)?;

                let total_likes: i32 = result.get(QlPath::Field("total_count"))?.as_i64()? as i32;

                PostInteractionResult::Like(total_likes)
            }
            Interaction::View => {
                let post_view = View {
                    created_at: Some(Datetime::now()),
                };

                let relation = post_view.relate(&params.user, &params.post_id);
                self.db.query(surreal_quote!(r#"#relate(&relation)"#)).await?;

                let result: SurrealQR = self.db.query(surreal_quote!("
                        SELECT out, count() as total_count from #id(&params.post_id)<-view 
                        GROUP BY out
                ")).await?.take(0)?;
                let total_views: i32 = result.get(QlPath::Field("total_count"))?.as_i64()? as i32;

                PostInteractionResult::View(total_views)
            },
            Interaction::Vote => {
                let post_vote = Vote {
                    created_at: Some(Datetime::now()),
                };

                let relation = post_vote.relate(&params.user, &params.post_id);
                self.db.query(surreal_quote!(r#"#relate(&relation)"#)).await?;

                let result: SurrealQR = self.db.query(surreal_quote!("
                        SELECT out, count() as total_count from #id(&params.post_id)<-vote
                        GROUP BY out"
                )).await?.take(0)?;
                let total_votes: i32 = result.get(QlPath::Field("total_count"))?.as_i64()? as i32;

                PostInteractionResult::Vote(total_votes)
            },
        };

        Ok(result)
    }
}
