pub mod vote_post;
pub mod create_post;
use core_services::Db;
use core_services::services::base::{Resolve, Service};

#[derive(Debug, Clone)]
pub struct PostService {
    pub db: Db
}

#[derive(Debug, Clone)]
pub struct VotePostParams {

}

pub struct VotePostResponse {

}

impl Service<VotePostParams, VotePostParams> for PostService {
    async fn execute(self, params: VotePostParams) -> Resolve<VotePostParams> {
        Ok(todo!())
    }
}
