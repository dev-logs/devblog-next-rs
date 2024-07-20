use core_services::Db;

pub mod new_discussion;
pub mod get_discussion;

#[derive(Debug)]
pub struct DiscussionService {
    pub db: Db
}
