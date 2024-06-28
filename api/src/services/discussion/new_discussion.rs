use core_services::services::base::{Resolve, Service};
use schema::devlog::devblog::entities::Discussion;

pub struct CreateDiscussionServiceImpl {}

impl Service<Discussion, Discussion> for CreateDiscussionServiceImpl {
    async fn execute(self, params: Discussion) -> Resolve<Discussion> {

    }
}
