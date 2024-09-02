use core_services::services::base::{Resolve, Service};
use core_services::services::errors::Errors;
use schema::devlog::devblog::entities::PostId;

use super::{GetPostParams, GetPostResonse, PostService};

#[async_trait::async_trait]
impl Service<GetPostParams, GetPostResonse,> for PostService {
    async fn execute(&self, params: GetPostParams,) -> Resolve<GetPostResonse,> {
        let post_id: PostId = PostId {
            title: params.title.clone(),
        };

        let post = self.post_repository.get(&post_id,).await?;
        if post.is_none() {
            return Err(Errors::ResourceNotFound(format!("Not found post with id={:?}", &post_id),),);
        }

        let total_likes = self.interaction_repository.count_like(&post_id,).await?;
        let total_views = self.interaction_repository.count_view(&post_id,).await?;
        let _total_votes = self.interaction_repository.count_vote(&post_id,).await?;

        match post {
            Some(post,) => Ok(GetPostResonse {
                post,
                total_likes,
                total_views,
            },),
            None => Err(Errors::ResourceNotFound(format!("Not found any post with id={:?}", post_id),),),
        }
    }
}
