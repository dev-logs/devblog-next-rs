use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::{
    devlog::entities::{Like, UserId, View, Vote},
    misc::datetime::Datetime,
};
use super::{Interaction, PostInteractionParams, PostInteractionResult, PostService};

#[async_trait::async_trait]
impl Service<PostInteractionParams, PostInteractionResult> for PostService {
    async fn execute(&self, params: PostInteractionParams) -> Resolve<PostInteractionResult> {
         let user_id = UserId {
            email: params.user.email.clone()
         };

         let result = match params.interaction {
            Interaction::Like(action) => {
                if action.count < 1 {
                    return Err(Errors::BadRequest("Like count must be positive number".to_owned()))
                }

                let post_like = Like {
                    count: action.count,
                    created_at: Some(Datetime::now()),
                };

                self.interaction_repository.create_like_post(&user_id, &params.post_id, post_like).await?;

                let total_likes = self.interaction_repository.count_like(&params.post_id).await?;

                PostInteractionResult::Like(total_likes)
            }
            Interaction::View => {
                let post_view = View {
                    created_at: Some(Datetime::now()),
                };


                self.interaction_repository.create_view_post(&user_id, &params.post_id, post_view).await?;
                let total_views = self.interaction_repository.count_view(&params.post_id).await?;

                PostInteractionResult::View(total_views)
            },
            Interaction::Vote => {
                let post_vote = Vote {
                    created_at: Some(Datetime::now()),
                };

                self.interaction_repository.create_vote_post(&user_id, &params.post_id, vote_psot).await?;
                let total_votes = self.interaction_repository.count_vote(&params.post_id).await?;

                PostInteractionResult::Vote(total_votes)
            },
        };

        Ok(result)
    }
}
