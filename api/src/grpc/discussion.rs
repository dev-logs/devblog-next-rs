use core_services::services::base::Service;
use schema::devlog::entities::User;
use tonic::{Result, Request, Response, Status};
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionService;
use schema::devlog::devblog::rpc::{GetDiscussionsRequest, GetDiscussionsResponse, NewDiscussionRequest, NewDiscussionResponse};

use crate::grpc::base::GRPCService;
use crate::services::discussion::new_discussion::{CreateDiscussionServiceImpl, NewDiscussionParams};
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
        let user: &User = request.extensions().get::<User>().ok_or(Status::unauthenticated("You're not authorize"))?;
        let request = request.get_ref();
        let service = CreateDiscussionServiceImpl { db: DB.clone() };
        let params = NewDiscussionParams {
            user,
            discussion: request.new_discussion.as_ref().expect("new_discussion must be defined"),
            post_id: request.post_id.as_ref().expect("Post_id must be defined")
        };

        let created_discussion = service.execute(params).await?;
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
