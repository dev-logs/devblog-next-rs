use log::info;
use schema::devlog::entities::User;
use schema::devlog::links::user_link;
use surreal_derive_plus::surreal_quote;
use tonic::{Result, Request, Response, Status};
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionService;
use schema::devlog::devblog::rpc::{GetDiscussionsRequest, GetDiscussionsResponse, NewDiscussionRequest, NewDiscussionResponse};
use crate::DB;

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
    async fn new_discussion(&self, mut request: Request<NewDiscussionRequest>) -> Result<Response<NewDiscussionResponse>, Status> {
        let mut request = request.get_mut();
        let mut new_discussion = request.new_discussion.take().expect("The discussion must be defined");
        let sender_identity = new_discussion.user.take().map(|mut it| it.link.take().unwrap()).expect("The sender must be defined");

        let sender = match sender_identity {
            user_link::Link::User(sender) => sender,
            user_link::Link::UserId(user_id) => {
               let result = DB.query(surreal_quote!(r#"SELECT * from #id(&user_id)"#)).await;
               User {
                   id: None,
                   password: "".to_string(),
                   name: "".to_string(),
                   email: "".to_string(),
               }
            }
        };

        let result = DB.query(surreal_quote!(r"
            CREATE #record(&new_discussion)
        ")).await;

        Err(Status::already_exists("message"))
    }

    async fn get_discussions(&self, request: Request<GetDiscussionsRequest>) -> Result<Response<GetDiscussionsResponse>, Status> {
        info!(target: "tiendang-debug", "here it come");
        Ok(Response::new(GetDiscussionsResponse {
            discussions: vec![],
            paging: request.get_ref().paging.clone()
        }))
    }
}
