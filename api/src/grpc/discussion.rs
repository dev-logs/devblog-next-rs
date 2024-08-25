use core_services::s3::S3Client;
use core_services::services::base::Service;
use schema::devlog::entities::User;
use tonic::{Result, Request, Response, Status};
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionService;
use schema::devlog::devblog::rpc::{GetDiscussionsRequest, GetDiscussionsResponse, NewDiscussionRequest, NewDiscussionResponse};

use crate::grpc::base::GRPCService;
use crate::services::discussion::GetListDiscussionsParam;
use crate::services::discussion::NewDiscussionParams;
use crate::services::discussion::DiscussionService;
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
        let s3 = S3Client::new().await;
        let service = DiscussionService {
            db: DB.clone(),
            s3
        };

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
        let request = request.get_ref();
        let service = DiscussionService {db:DB.clone(), s3: S3Client::new().await };
        let param = GetListDiscussionsParam {
            paging: request.paging.as_ref().unwrap().clone(),
            post_id: request.post_id.clone().unwrap()
        };

        let result = service.execute(param).await?;
        Ok(Response::new(GetDiscussionsResponse {
            discussions: result.discussions,
            paging: Some(result.paging)
        }))
    }
}
