pub mod create_post;
pub mod get_post;
pub mod interact;

use core_services::Db;
use core_services::services::base::Service;
use schema::devlog::devblog::entities::{Post, PostId};
use schema::devlog::entities::{Like, User};

#[derive(Debug, Clone)]
pub struct PostService {
    pub db: Db
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
    pub interaction: Interaction,
}

#[derive(Clone, Debug)]
pub enum PostInteractionResult {
    Like(i32),
    View(i32),
    Vote(i32),
}

pub trait PostInteractionService : Service<PostInteractionParams, PostInteractionResult> {}

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

pub trait GetPostService : Service<GetPostParams, GetPostResonse> {}

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

pub trait CreatePostService : Service<CreatePostParams, CreatePostResult> {}

impl CreatePostService for PostService {}

