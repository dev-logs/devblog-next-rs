use core_services::services::base::{Resolve, Service};
use schema::{
    devlog::rpc::Paging,
    surrealdb::links::user_link
};
use core_services::services::errors::Errors;
use async_trait::async_trait;
use super::{DiscussionService, GetListDiscussionsParam, GetListDiscussionsResult};

#[async_trait]
impl Service<GetListDiscussionsParam, GetListDiscussionsResult> for DiscussionService {
    async fn execute(&self, params: GetListDiscussionsParam) -> Resolve<GetListDiscussionsResult> {
        let paging = params.paging;
        if paging.rows_per_page < 1 || paging.page < 1 {
            return Err(Errors::BadRequest("The rows_per_page and page must be positive number".to_string()));
        }

        let start = paging.rows_per_page * (paging.page - 1);
        let limit = paging.rows_per_page;

        let total_count: i32 = self.discussion_repository.count_discussion(&params.post_id).await?;
        let mut total_pages = total_count / paging.rows_per_page;
        if total_count % paging.rows_per_page > 0 {
            total_pages += 1;
        }

        let mut result = self.discussion_repository.get_discussions(&params.post_id, start, limit).await?;

        for discussion_item in &mut result {
            let link = discussion_item.user.as_mut().unwrap().link.as_mut().unwrap();
            if let user_link::Link::Object(user) = link {
                if let Some(ref mut avatar) = &mut user.avatar_object {
                    self.s3.use_cdn(avatar).await?;
                }
            }
        }

        return Ok(GetListDiscussionsResult {
            discussions: result,
            paging: Paging {
                total_pages,
                page: paging.page,
                rows_per_page: paging.rows_per_page,
            }}
        );
    }
}

