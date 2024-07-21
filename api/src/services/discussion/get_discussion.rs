use core_services::services::{base::{Resolve, Service}};
use schema::devlog::{devblog::entities::Discussion, rpc::Paging};
use surreal_derive_plus::surreal_quote;
use surrealdb::sql::{Array, Value};

use super::DiscussionService;

#[derive(Debug, Clone)]
pub struct GetListDiscussionsParam {
    pub paging: Paging
}

#[derive(Debug, Clone)]
pub struct GetListDiscusssionsResult {
    pub discussions: Vec<Discussion>
}

impl Service<GetListDiscussionsParam, GetListDiscusssionsResult> for DiscussionService {
    async fn execute(self, params: GetListDiscussionsParam) -> Resolve<GetListDiscusssionsResult> {
        let paging = params.paging;
        let start = paging.rows_per_page * (paging.page - 1);
        let limit = paging.rows_per_page;

        let result: Value = self.db.query(surreal_quote!("SELECT * FROM discussion start #start limit #limit")).await?.take(0)?;
        if let Value::Array(Array(result)) = result {
            let result = result.into_iter().map(|it| Discussion::from(it)).collect::<Vec<Discussion>>();
            return Ok(GetListDiscusssionsResult { discussions: result })
        }

        Ok(GetListDiscusssionsResult { discussions: vec![] })
    }
}
