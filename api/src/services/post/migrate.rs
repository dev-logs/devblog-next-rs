// Read the posts in bumped folder and migrate to database.

use crate::config::CONFIGS;
use core_services::services::base::{Resolve, Service, VoidResponse};
use core_services::services::errors::Errors;
use log::info;
use prost::bytes::Bytes;
use prost::Message;
use schema::devlog::devblog::entities::Post;
use std::path::Path;
use std::u8;
use tokio::fs;
use tokio::io::AsyncReadExt;

use super::{MigratePostParams, PostService};

#[async_trait::async_trait]
impl Service<MigratePostParams, VoidResponse> for PostService {
    async fn execute(&self, _: MigratePostParams) -> Resolve<VoidResponse> {
        let file_path = Path::new(CONFIGS.post_migrate.bumped_folder_path.as_str());
        if !file_path.is_dir() {
            return Err(Errors::ResourceNotFound(
                format!(
                    "Expected a dumped content folder at {} make sure you call yarn content:build in web folder first",
                    CONFIGS.post_migrate.bumped_folder_path.as_str()
                )
                .to_owned()
            ));
        }

        let mut files = fs::read_dir(file_path)
            .await
            .map_err(|_| Errors::ResourceNotFound("Invalid operation or resource does not exist".to_owned()))?;
        while let Some(entry) = files
            .next_entry()
            .await
            .map_err(|_| Errors::ResourceNotFound("Invalid operation or resource does not exist".to_owned()))?
        {
            let file_path = entry.path();
            let mut file = fs::File::open(&file_path).await.unwrap();
            let mut bytes: Vec<u8> = vec![];
            file.read_to_end(&mut bytes).await.unwrap();

            let post = Post::decode(Bytes::from(bytes)).map_err(|_| {
                Errors::BadRequest(
                    format!("Binary of file {:?} is not compatible to Schema", file_path.to_str()).to_owned()
                )
            })?;
            info!(target: "migrate-post", "Migrating post {}", post.title.as_str());

            if let Err(e) = self.post_repository.create(&post).await {
                info!(target: "migrate-post", "Failed to migrate post {} error: {:?}, skipping...", post.title.as_str(), e)
            }
        }

        Ok(())
    }
}
