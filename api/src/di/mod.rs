use std::time::Duration;

use core_services::db::{SurrealDbConnection, SurrealDbConnectionInfo, SurrealDbPoolResourceProvider};
use core_services::s3::{S3Client, S3ClientResourceProvider};
use core_services::smtp::client::SmtpPoolResourceProvider;
use core_services::utils::pool::allocator::PoolBuilder;
use core_services::utils::pool::cleanup::CleanupStrategy;
use core_services::utils::pool::request::{PoolRequest, PoolRequestBuilder};
use core_services::{S3Connection, SmtpTransport};

use crate::repository::author::AuthorRepository;
use crate::repository::discussion::DiscussionRepository;
use crate::repository::interactive::InteractionRepository;
use crate::repository::post::PostRepository;
use crate::repository::surrealdb::author::AuthorSurrealDbRepository;
use crate::repository::surrealdb::discussion::DiscussionSurrealDbRepository;
use crate::repository::surrealdb::interaction::InteractionSurrealDb;
use crate::repository::surrealdb::post::PostSurrealDbRepository;
use crate::services::discussion::{DiscussionService, GetDiscussionsService, NewDiscussionService};
use crate::services::post::{
    CreatePostService,
    GetPostService,
    MigratePostService,
    PostInteractionService,
    PostService
};
use crate::{grpc, S3ConnectionPool, SmtpTransportPool};
use devlog_sdk::sdk::{DevlogSdk, SharingResource};
use log::info;
use tokio::sync::OnceCell;

use crate::{DevblogPool, DevlogPool};

pub struct ApiDependenciesInjection {
    pub devlog_sdk: OnceCell<DevlogSdk>,
    pub devlog_db: OnceCell<DevlogPool>,
    pub devblog_db: OnceCell<DevblogPool>,
    pub s3_client: OnceCell<S3ConnectionPool>,
    pub smtp_client: OnceCell<SmtpTransportPool>
}

impl ApiDependenciesInjection {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let me = Self {
            devlog_db: OnceCell::new(),
            devblog_db: OnceCell::new(),
            smtp_client: OnceCell::new(),
            s3_client: OnceCell::new(),
            devlog_sdk: OnceCell::new()
        };

        me.setup_db().await?;
        me.setup_s3().await?;
        me.setup_smtp().await?;
        me.setup_sdk().await?;

        Ok(me)
    }

    async fn setup_sdk(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.devlog_sdk
            .get_or_init(|| async move {
                DevlogSdk::new(SharingResource {
                    smtp_transport: self.smtp_pool_request().expect("Smtp client connection failed"),
                    s3: self.s3_pool_request().expect("S3 client connection failed"),
                    devlog_db: self.devlog_pool_request().expect("Devlog db connection failed")
                })
            })
            .await;

        Ok(())
    }

    fn s3_pool_request(&self) -> Result<PoolRequest<S3Connection>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.s3_client.get().unwrap().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn smtp_pool_request(&self) -> Result<PoolRequest<SmtpTransport>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.smtp_client.get().unwrap().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn devlog_pool_request(
        &self
    ) -> Result<PoolRequest<SurrealDbConnection>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.devblog_db.get().unwrap().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn devblog_pool_request(
        &self
    ) -> Result<PoolRequest<SurrealDbConnection>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.devblog_db.get().unwrap().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    async fn setup_db(&self) -> Result<(), Box<dyn std::error::Error>> {
        let ns = "devblog-api";
        self.devblog_db
            .get_or_init(|| async move {
                info!(target: ns, "Connecting to devblog database");
                PoolBuilder::new(Box::new(SurrealDbPoolResourceProvider {info: crate::config::CONFIGS.surreal_db.clone()}))
                    .min_pool_size(10)
                    .max_pool_size(1000)
                    .build()
                    .await
            })
            .await;

        self.devlog_db
            .get_or_init(|| async move {
                info!(target: ns, "Connecting to devlog database");
                PoolBuilder::new(Box::new(SurrealDbPoolResourceProvider {info: devlog_sdk::config::CONFIGS.surrealdb.clone()}))
                    .min_pool_size(10)
                    .max_pool_size(100)
                    .build()
                    .await
            })
            .await;

        Ok(())
    }

    async fn setup_s3(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.s3_client
            .get_or_init(|| async move {
                PoolBuilder::new(Box::new(S3ClientResourceProvider))
                    .min_pool_size(1)
                    .max_pool_size(1000)
                    .cleanup(CleanupStrategy::Best {
                        interval: Duration::new(100, 0),
                        min_pool_size: 5
                    })
                    .build()
                    .await
            })
            .await;

        Ok(())
    }

    async fn setup_smtp(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.smtp_client
            .get_or_init(|| async move {
                PoolBuilder::new(Box::new(SmtpPoolResourceProvider))
                    .min_pool_size(1)
                    .max_pool_size(1000)
                    .cleanup(CleanupStrategy::Best {
                        interval: Duration::new(100, 0),
                        min_pool_size: 5
                    })
                    .build()
                    .await
            })
            .await;

        Ok(())
    }

    fn s3_client(&self) -> Result<S3Client, Box<dyn std::error::Error>> {
        Ok(S3Client {
            client: self.s3_pool_request()?
        })
    }

    //fn smtp_client(&self) -> Result<SmtpClient, Box<dyn std::error::Error>> {
    //    Ok(SmtpClient {
    //        transport: self.smtp_pool_request()?
    //    })
    //}

    pub fn discussion_repository(&self) -> impl DiscussionRepository {
        DiscussionSurrealDbRepository {
            db: self.devblog_pool_request().expect("Devblog db must be connected")
        }
    }

    pub fn post_repository(&self) -> impl PostRepository {
        PostSurrealDbRepository {
            db: self.devblog_pool_request().expect("Devblog db must be connected")
        }
    }

    pub fn interaction_repository(&self) -> impl InteractionRepository {
        InteractionSurrealDb {
            db: self.devblog_pool_request().expect("Devblog db must be connected")
        }
    }

    pub fn author_repository(&self) -> impl AuthorRepository {
        AuthorSurrealDbRepository {
            db: self.devblog_pool_request().expect("Devblog must be connected")
        }
    }

    pub fn new_discussion_service(&self) -> impl NewDiscussionService {
        DiscussionService {
            s3: self.s3_client().unwrap(),
            discussion_repository: Box::new(self.discussion_repository()),
            post_repository: Box::new(self.post_repository())
        }
    }

    pub fn list_discussion_service(&self) -> impl GetDiscussionsService {
        DiscussionService {
            s3: self.s3_client().unwrap(),
            discussion_repository: Box::new(self.discussion_repository()),
            post_repository: Box::new(self.post_repository())
        }
    }

    pub fn create_post_service(&self) -> impl CreatePostService {
        PostService {
            post_repository: Box::new(self.post_repository()),
            interaction_repository: Box::new(self.interaction_repository()),
            author_repository: Box::new(self.author_repository())
        }
    }

    pub fn get_post_service(&self) -> impl GetPostService {
        PostService {
            post_repository: Box::new(self.post_repository()),
            interaction_repository: Box::new(self.interaction_repository()),
            author_repository: Box::new(self.author_repository())
        }
    }

    pub fn interaction_service(&self) -> impl PostInteractionService {
        PostService {
            post_repository: Box::new(self.post_repository()),
            interaction_repository: Box::new(self.interaction_repository()),
            author_repository: Box::new(self.author_repository())
        }
    }

    pub fn migrate_post_service(&self) -> impl MigratePostService {
        PostService {
            post_repository: Box::new(self.post_repository()),
            interaction_repository: Box::new(self.interaction_repository()),
            author_repository: Box::new(self.author_repository())
        }
    }

    pub fn grpc_authentication_service(&'static self) -> grpc::authentication::AuthenticationGrpcService {
        grpc::authentication::AuthenticationGrpcService { di: self }
    }

    pub fn grpc_post_service(&'static self) -> grpc::post::PostGrpcServer {
        grpc::post::PostGrpcServer { di: self }
    }

    pub fn grpc_discussion_service(&'static self) -> grpc::discussion::DiscussionGrpcService {
        grpc::discussion::DiscussionGrpcService { di: self }
    }
}
