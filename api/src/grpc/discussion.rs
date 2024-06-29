use core_services::services::base::Service;
use log::info;
use tonic::{Result, Request, Response, Status};
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionService;
use schema::devlog::devblog::rpc::{GetDiscussionsRequest, GetDiscussionsResponse, NewDiscussionRequest, NewDiscussionResponse};

use crate::grpc::base::GRPCService;
use crate::services::discussion::new_discussion::{CreateDiscussionServiceImpl};
use crate::DB;

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
        let request = request.get_ref();
        let service = CreateDiscussionServiceImpl { db: DB.clone() };
        let discussion = request.new_discussion.as_ref().unwrap();
        let created_discussion = service.execute(discussion).await?;

        let response = NewDiscussionResponse {};
        Ok(Response::new(response))
    }

    async fn get_discussions(&self, request: Request<GetDiscussionsRequest>) -> Result<Response<GetDiscussionsResponse>, Status> {
        Ok(Response::new(GetDiscussionsResponse {
            discussions: vec![],
            paging: request.get_ref().paging.clone()
        }))
    }
}
