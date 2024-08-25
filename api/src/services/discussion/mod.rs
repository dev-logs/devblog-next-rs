use core_services::{s3::S3Client, services::base::Service, Db};
use schema::devlog::{devblog::entities::{Discussion, PostId}, entities::User, rpc::Paging};

pub mod new_discussion;
pub mod get_discussion;

#[derive(Debug)]
pub struct DiscussionService {
    pub db: Db,
    pub s3: S3Client
}

#[derive(Debug, Clone)]
pub struct NewDiscussionParams<'a> {
    pub discussion: &'a Discussion,
    pub post_id: &'a PostId,
    pub user: &'a User
}

pub trait NewDiscussionService<'a> : Service<NewDiscussionParams<'a>, Discussion> {}

#[derive(Debug, Clone)]
pub struct GetListDiscussionsParam {
    pub paging: Paging,
    pub post_id: PostId
}

#[derive(Debug, Clone)]
pub struct GetListDiscussionsResult {
    pub discussions: Vec<Discussion>,
    pub paging: Paging
}

pub trait GetDiscussionsService : Service<GetListDiscussionsParam, GetListDiscussionsResult> {}

impl GetDiscussionsService for DiscussionService {}
impl <'a> NewDiscussionService<'a> for DiscussionService {}
