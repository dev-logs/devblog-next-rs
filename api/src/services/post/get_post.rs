use core_services::{services::{base::{Resolve, Service}, errors::Errors}, Db};
use schema::devlog::devblog::entities::{Post, PostId};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::{QlPath, SurrealQR};

use super::{GetPostParams, GetPostResonse, PostService};

#[async_trait::async_trait]
impl Service<GetPostParams, GetPostResonse> for PostService {
    async fn execute(&self, params: GetPostParams) -> Resolve<GetPostResonse> {
        let post_id: PostId = PostId {
            title: params.title.clone(),
        };

        let total_likes: SurrealQR = self.db.query(surreal_quote!("
                SELECT out, math::sum(count) as total_likes
                FROM #val(&post_id)<-like
                GROUP BY out
         ")).await?.take(0)?;

        let total_likes = total_likes.get(QlPath::Field("total_likes"))?.as_i64().unwrap_or(0) as i32;

        let total_views: SurrealQR = self.db.query(surreal_quote!("
                SELECT out, count() as total_views
                FROM #val(&post_id)<-view
                GROUP BY out
        ")).await?.take(0)?;

        let total_views= total_views.get(QlPath::Field("total_views"))?.as_i64().unwrap_or(0) as i32;

        let total_votes: SurrealQR = self.db.query(surreal_quote!("
                SELECT out, count() as total_votes
                FROM #val(&post_id)<-vote
                GROUP BY out
        ")).await?.take(0)?;

        let total_votes= total_votes.get(QlPath::Field("total_votes"))?.as_i64().unwrap_or(0) as i32;

        let post: SurrealQR = self.db.query(surreal_quote!("SELECT * FROM #val(&post_id)")).await?.take(0)?;
        let post = post.object()?.map(|it| {
            Post::from(it)
        });

        match post {
            Some(post) => Ok(
                GetPostResonse {
                    post,
                    total_likes,
                    total_views
                }
            ),
            None => Err(Errors::ResourceNotFound(format!("Not found any post with id={:?}", post_id))),
        }
    }
}
