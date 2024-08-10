use core_services::{services::{base::{Resolve, Service}, errors::Errors}, Db};
use log::{info, log};
use schema::{devlog::{devblog::entities::{Author, AuthorId, Post}, entities::User}, misc::datetime::Datetime, surrealdb::links::{author_link, AuthorLink}};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::SurrealQR;

#[derive(Debug)]
pub struct CreatePostService {
    pub db: Db
}

#[derive(Debug, Clone)]
pub struct CreatePostResult {
    pub post: Post
}

#[derive(Debug, Clone)]
pub struct CreatePostParams {
    pub post: Post,
    pub user: User
}

impl Service<CreatePostParams, CreatePostResult> for CreatePostService {
    async fn execute(self, params: CreatePostParams) -> Resolve<CreatePostResult> {
        info!(target: "tiendang-debug", "Creating post");
        if params.user.name != String::from("system") {
            return Err(Errors::UnAuthorized("Only system is allowed".to_owned()));
        }

        let author: Author = match params.post.author.as_ref().map(|it| it.link.as_ref().unwrap()) {
            Some(author_link::Link::Object(author)) => {
                let mut found_author: Option<Author> = self.db.query(surreal_quote!("SELECT * FROM #id(&author)")).await?.take(0)?;
                if found_author.is_none() {
                    found_author = self.db.query(surreal_quote!("CREATE #record(&author)")).await?.take(0)?;
                }

                found_author.unwrap()
            },
            _ => {
                return Err(Errors::BadRequest("The author is required".to_string()));
            }
        };

        let mut new_post = params.post.clone();
        new_post.created_at = Some(Datetime::now());
        let existing_post: SurrealQR = self.db.query(surreal_quote!("SELECT * FROM #id(&params.post)")).await?.take(0)?;
        let existing_post = existing_post.object()?;
        if existing_post.is_some() {
            return Ok(CreatePostResult { post: existing_post.map(|it| Post::from(it)).unwrap()});
        }

        let author_id: AuthorId = AuthorId {
            email: author.email,
        };

        new_post.author = Some(AuthorLink {link: Some(author_link::Link::Id(author_id))});
        let statement = surreal_quote!("CREATE #id(&new_post) #set(&new_post)");
        let create_post: SurrealQR = self.db.query(statement).await?.take(0)?;
        let created_post = create_post.object()?.map(|it| Post::from(it));
        Ok(CreatePostResult {
            post: created_post.expect("The post must be created")
        })
    }
}
