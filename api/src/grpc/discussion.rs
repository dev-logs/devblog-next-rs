use schema::devblog::devblog::devblog_discussion_service_server::{DevblogDiscussionService};
use schema::devblog::devblog::{NewDiscussionRequest, NewDiscussionResponse, GetDiscussionsResponse, GetDiscussionsRequest};

use tonic::{Result, Request, Response, Status};

use crate::grpc::base::GRPCService;

#[derive(Debug, Clone)]
pub struct DiscussionGrpcService {}

impl GRPCService for DiscussionGrpcService {
    fn new() -> Self {
       Self {}
    }
}

#[tonic::async_trait]
impl DevblogDiscussionService for DiscussionGrpcService {
    async fn new_discussion(&self, request: Request<NewDiscussionRequest>) -> Result<Response<NewDiscussionResponse>, Status> {
        Result::Err(Status::aborted("message"))
    }

    async fn get_discussions(&self, request: Request<GetDiscussionsRequest>) -> Result<Response<GetDiscussionsResponse>, Status> {
        Result::Err(Status::aborted("message"))
    }
}
