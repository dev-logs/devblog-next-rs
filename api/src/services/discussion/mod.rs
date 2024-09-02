use core_services::s3::S3Client;
use core_services::services::base::Service;
use schema::devlog::devblog::entities::{Discussion, PostId};
use schema::devlog::entities::User;
use schema::devlog::rpc::Paging;

use crate::repository::discussion::DiscussionRepository;
use crate::repository::post::PostRepository;

pub mod get_discussion;
pub mod new_discussion;

pub struct DiscussionService {
    pub discussion_repository: Box<dyn DiscussionRepository + Send + Sync + 'static>,
    pub post_repository: Box<dyn PostRepository + Send + Sync + 'static>,
    pub s3: S3Client
}

#[derive(Debug, Clone)]
pub struct NewDiscussionParams<'a> {
    pub discussion: &'a Discussion,
    pub post_id: &'a PostId,
    pub user: &'a User
}

pub trait NewDiscussionService<'a>: Service<NewDiscussionParams<'a>, Discussion> {}

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

pub trait GetDiscussionsService: Service<GetListDiscussionsParam, GetListDiscussionsResult> {}

impl GetDiscussionsService for DiscussionService {}
impl<'a> NewDiscussionService<'a> for DiscussionService {}
