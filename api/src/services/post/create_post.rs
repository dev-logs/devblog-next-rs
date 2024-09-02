use core_services::services::base::{Resolve, Service};
use core_services::services::errors::Errors;
use schema::devlog::devblog::entities::{Author, AuthorId, PostId};
use schema::misc::datetime::Datetime;
use schema::surrealdb::links::{author_link, AuthorLink};

use super::{CreatePostParams, CreatePostResult, PostService};

#[async_trait::async_trait]
impl Service<CreatePostParams, CreatePostResult,> for PostService {
    async fn execute(&self, params: CreatePostParams,) -> Resolve<CreatePostResult,> {
        if params.user.name != String::from("system",) {
            return Err(Errors::UnAuthorized("Only system is allowed".to_owned(),),);
        }

        let author: Author = match params.post.author.as_ref().map(|it| it.link.as_ref().unwrap(),) {
            Some(author_link::Link::Object(author,),) => {
                let author_id = AuthorId {
                    email: author.email.clone(),
                };
                let mut found_author: Option<Author,> = self.author_repository.get(&author_id,).await?;
                if found_author.is_none() {
                    found_author = Some(self.author_repository.create(&author,).await?,);
                }

                found_author.unwrap()
            }
            _ => {
                return Err(Errors::BadRequest("The author is required".to_string(),),);
            }
        };

        let mut new_post = params.post.clone();
        new_post.created_at = Some(Datetime::now(),);
        let post_id = PostId {
            title: new_post.title.clone(),
        };
        let existing_post = self.post_repository.get(&post_id,).await?;
        if existing_post.is_some() {
            return Ok(CreatePostResult {
                post: existing_post.unwrap(),
            },);
        }

        let author_id: AuthorId = AuthorId { email: author.email, };

        new_post.author = Some(AuthorLink {
            link: Some(author_link::Link::Id(author_id,),),
        },);
        let create_post = self.post_repository.create(&new_post,).await?;
        Ok(CreatePostResult { post: create_post, },)
    }
}
