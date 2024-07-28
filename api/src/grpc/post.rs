use core_services::{services::base::Service, DB};
use log::info;
use schema::devlog::{devblog::rpc::{post_interaction_request, post_interaction_response::InteractionResult, post_service_server::PostService, CreatePostRequest, CreatePostResponse, GetPostRequest, GetPostResponse, PostInteractionRequest, PostInteractionResponse}, entities::{Like, User}};
use tonic::{Request, Response, Status};

use crate::services::{interaction::like::{Interaction, PostInteractionParams, PostInteractionResult, PostInteractionService}, post::get_post::{GetPostParams, GetPostService}};
use crate::services::post::create_post::{CreatePostParams, CreatePostService};

#[derive(Debug, Clone)]
pub struct PostGrpcService {}

impl PostGrpcService {
   pub fn new() -> Self {
       Self {}
   }
}

#[tonic::async_trait]
impl PostService for PostGrpcService {
    async fn get(&self, request: Request<GetPostRequest>) -> Result<Response<GetPostResponse>, tonic::Status> {
        let request = request.get_ref();
        let service = GetPostService {
            db: DB.clone()
        };

        let params = GetPostParams {
            title: request.title.clone()
        };

        let result = service.execute(params).await?;
        Ok(Response::new(GetPostResponse {
            total_likes: result.total_likes,
            total_views: result.total_views,
            post: Some(result.post)
        }))
    }

    async fn create(&self, request: Request<CreatePostRequest>) -> Result<Response<CreatePostResponse>, tonic::Status> {
        let user: &User = request.extensions().get::<User>().ok_or(Status::unauthenticated("You're not authorize"))?;

        let service = CreatePostService {
            db: DB.clone()
        };

        let request = request.get_ref();
        let params = CreatePostParams {
            post: request.post.clone().unwrap(),
            user: user.clone()
        };

        let result = service.execute(params).await?;
        Ok(Response::new(CreatePostResponse {
            post: Some(result.post)
        }))
    }

    async fn interact(&self, request: Request<PostInteractionRequest>) -> Result<Response<PostInteractionResponse>, tonic::Status> {
        let user: &User = request.extensions().get::<User>().ok_or(Status::unauthenticated("You're not authorize"))?;

        let service = PostInteractionService {
            db: DB.clone()
        };

        let request = request.get_ref();
        let post_id = request.id.as_ref().expect("The post id is required").clone();
        info!(target: "tiendnag-debug", "hello");
        let interaction = match &request.interaction {
            Some(post_interaction_request::Interaction::Like(like)) => Interaction::Like(like.clone()),
            _ => return Err(Status::invalid_argument("Not support this interaction in post")),
        };

        let like_post_params = PostInteractionParams {
            user: user.clone(),
            post_id,
            interaction
        };

        let result = service.execute(like_post_params).await?;
        match result {
            PostInteractionResult::Like(count) => Ok(Response::new(PostInteractionResponse { interaction_result: Some(InteractionResult::TotalLikeCount(count)) })),
        }
    }
}
