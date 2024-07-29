use core_services::{s3::S3Client, Db};

pub mod new_discussion;
pub mod get_discussion;

#[derive(Debug)]
pub struct DiscussionService {
    pub db: Db,
    pub s3: S3Client
}
