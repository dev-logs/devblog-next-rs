use schema::devlog::devblog::rpc::{post_service_server::PostService, VotePostRequest, VotePostResponse};
use tonic::{Request, Response};

#[derive(Debug, Clone)]
pub struct PostGrpcService {}

#[tonic::async_trait]
impl PostService for PostGrpcService {
    async fn vote_post(&self, request: Request<VotePostRequest>) -> Result<Response<VotePostResponse>, tonic::Status> {
       let response = VotePostResponse { current_vote: 2 };
       Ok(Response::new(response))
    }
}
