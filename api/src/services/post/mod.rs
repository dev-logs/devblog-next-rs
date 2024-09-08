pub mod create_post;
pub mod get_post;
pub mod interact;
pub mod migrate;

use core_services::services::base::{Service, VoidResponse};
use schema::devlog::devblog::entities::{Post, PostId};
use schema::devlog::entities::{Like, User};

use crate::repository::author::AuthorRepository;
use crate::repository::interactive::InteractionRepository;
use crate::repository::post::PostRepository;

pub struct PostService {
    pub post_repository: Box<dyn PostRepository + Sync + Send>,
    pub interaction_repository: Box<dyn InteractionRepository + Send + Sync>,
    pub author_repository: Box<dyn AuthorRepository + Send + Sync>
}

#[derive(Debug, Clone)]
pub enum Interaction {
    Like(Like),
    View,
    Vote
}

#[derive(Clone, Debug)]
pub struct PostInteractionParams {
    pub user: User,
    pub post_id: PostId,
    pub interaction: Interaction
}

#[derive(Clone, Debug)]
pub enum PostInteractionResult {
    Like(i32),
    View(i32),
    Vote(i32)
}

pub trait PostInteractionService: Service<PostInteractionParams, PostInteractionResult> {}

impl PostInteractionService for PostService {}

#[derive(Debug, Clone)]
pub struct GetPostParams {
    pub title: String
}

#[derive(Debug, Clone)]
pub struct GetPostResonse {
    pub post: Post,
    pub total_likes: i32,
    pub total_views: i32
}

pub trait GetPostService: Service<GetPostParams, GetPostResonse> {}

impl GetPostService for PostService {}

#[derive(Debug, Clone)]
pub struct CreatePostResult {
    pub post: Post
}

#[derive(Debug, Clone)]
pub struct CreatePostParams {
    pub post: Post,
    pub user: User
}

pub trait CreatePostService: Service<CreatePostParams, CreatePostResult> {}

impl CreatePostService for PostService {}

#[derive(Debug, Clone)]
pub struct MigratePostParams {}

pub trait MigratePostService: Service<MigratePostParams, VoidResponse> {}

impl MigratePostService for PostService {}
