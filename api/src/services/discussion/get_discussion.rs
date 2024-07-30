use std::time::Duration;

use core_services::services::base::{Resolve, Service};
use schema::{devlog::{devblog::entities::Discussion, rpc::Paging}, surrealdb::links::user_link};
use surreal_derive_plus::surreal_quote;
use surreal_devl::wrapper::SurrealQR;
use core_services::services::errors::Errors;
use super::DiscussionService;

#[derive(Debug, Clone)]
pub struct GetListDiscussionsParam {
    pub paging: Paging
}

#[derive(Debug, Clone)]
pub struct GetListDiscussionsResult {
    pub discussions: Vec<Discussion>,
    pub paging: Paging
}

impl Service<GetListDiscussionsParam, GetListDiscussionsResult> for DiscussionService {
    async fn execute(self, params: GetListDiscussionsParam) -> Resolve<GetListDiscussionsResult> {
        let paging = params.paging;
        if paging.rows_per_page < 1 || paging.page < 1 {
            return Err(Errors::BadRequest("The rows_per_page and page must be positive number".to_string()));
        }

        let start = paging.rows_per_page * (paging.page - 1);
        let limit = paging.rows_per_page;

        let total_count: Option<i32> = self.db.query("SELECT count() from discussion group all").await?.take((0, "count"))?;
        let total_count = total_count.expect("Can not count records in table discussions");
        let mut total_pages = total_count / paging.rows_per_page;
        if total_count % paging.rows_per_page > 0 {
            total_pages += 1;
        }

        let result: SurrealQR = self.db.query(surreal_quote!("SELECT *, in AS user FROM discussion ORDER BY created_at DESC START #start LIMIT #limit FETCH user")).await?.take(0)?;
        let result = result.array()?;
        if None == result.as_ref() {
            return Ok(GetListDiscussionsResult {discussions: vec![], paging: Paging {
                total_pages,
                page: paging.page,
                rows_per_page: paging.rows_per_page,
            }});
        }

        let result = result.unwrap().0;
        let mut result = result.into_iter().map(|it| Discussion::from(it)).collect::<Vec<Discussion>>();

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
