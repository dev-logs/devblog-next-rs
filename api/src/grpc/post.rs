use core_services::{services::base::Service, DB};
use log::info;
use schema::devlog::{
    devblog::rpc::{
        post_interaction_request,
        post_interaction_response::InteractionResult,
        post_service_server::PostService as PostGrpcService,
        CreatePostRequest,
        CreatePostResponse,
        GetPostRequest,
        GetPostResponse,
        PostInteractionRequest,
        PostInteractionResponse
    },
    entities::{Like, User}
};
use tonic::{Request, Response, Status};

use crate::services::post::*;

#[derive(Debug, Clone)]
pub struct PostGrpcServer {}

impl PostGrpcServer {
   pub fn new() -> Self {
       Self {}
   }
}

#[async_trait::async_trait]
impl PostGrpcService for PostGrpcServer {
    async fn get(&self, request: Request<GetPostRequest>) -> Result<Response<GetPostResponse>, tonic::Status> {
        let request = request.get_ref();
        let service = PostService {
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

        let service = PostService {
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

        let service = PostService {
            db: DB.clone()
        };

        let request = request.get_ref();
        let post_id = request.id.as_ref().expect("The post id is required").clone();
        let interaction = match &request.interaction {
            Some(post_interaction_request::Interaction::Like(like)) => Interaction::Like(like.clone()),
            Some(post_interaction_request::Interaction::Vote(vote)) => Interaction::Vote,
            Some(post_interaction_request::Interaction::View(view)) => Interaction::View,
            _ => return Err(Status::invalid_argument("Not support this interaction in post")),
        };

        let like_post_params = PostInteractionParams {
            user: user.clone(),
            post_id,
            interaction
        };

        let result = service.execute(like_post_params).await?;
        match result {
            PostInteractionResult::Like(count)=> Ok(Response::new(PostInteractionResponse{interaction_result:Some(InteractionResult::TotalLikeCount(count))})),
            PostInteractionResult::View(count) => Ok(Response::new(PostInteractionResponse{interaction_result:Some(InteractionResult::TotalViewCount(count))})),
            PostInteractionResult::Vote(count) => Ok(Response::new(PostInteractionResponse{interaction_result:Some(InteractionResult::TotalVoteCount(count))})),
        }
    }
}
