use core_services::{services::{base::{Resolve, Service}, errors::Errors}, Db};
use log::info;
use schema::devlog::devblog::entities::{Post, PostId};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::{QlPath, SurrealQR};

#[derive(Debug, Clone)]
pub struct GetPostService {
    pub db: Db
}

#[derive(Debug, Clone)]
pub struct GetPostParams {
    pub title: String
}

#[derive(Debug, Clone)]
pub struct GetPostResonse {
   pub post: Post,
   pub total_likes: i32,
   pub total_views: i32
}

impl Service<GetPostParams, GetPostResonse> for GetPostService {
    async fn execute(self, params: GetPostParams) -> Resolve<GetPostResonse> {
        let post_id: PostId = PostId {
            title: params.title.clone(),
        };

        let total_likes: SurrealQR = self.db.query(surreal_quote!("SELECT out, math::sum(count) as total_likes FROM #val(&post_id)<-like GROUP BY out")).await?.take(0)?;
        let total_likes = total_likes.get(QlPath::Field("total_likes"))?.as_i64()? as i32;
        let post: SurrealQR = self.db.query(surreal_quote!("SELECT * FROM #val(&post_id)")).await?.take(0)?;
        let post = post.object()?.map(|it| {
            Post::from(it)
        });

        match post {
            Some(post) => Ok(
                GetPostResonse {
                    post,
                    total_likes,
                    total_views: 0 // TODO
                }
            ),
            None => Err(Errors::ResourceNotFound(format!("Not found any post with id={:?}", post_id))),
        }
    }
}
