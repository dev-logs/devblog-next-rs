use std::time::Duration;

use core_services::{db::{SurrealDbConnection, SurrealDbConnectionInfo}, s3::S3Client, smtp::client::SmtpClient, utils::{pool::{allocator::PoolBuilder, cleanup::CleanupStrategy, request::{PoolRequest, PoolRequestBuilder}}, pool_allocator::PoolRequest}, S3Connection, SmtpTransport};
use devlog_sdk::sdk::{DevlogSdk, SharingResource};
use log::info;
use schema::devlog::{devblog::rpc::devblog_discussion_service_server::{DevblogDiscussionService, DevblogDiscussionServiceServer}, rpc::authentication_service_server::AuthenticationService};
use crate::{grpc::{authentication::AuthenticationGrpcService, discussion::DiscussionGrpcService}, services::discussion::{DiscussionService, NewDiscussionService}, S3ConnectionPool, SmtpTransportPool};
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
            devlog_sdk: OnceCell::new(),
        };

        me.setup_db().await?;
        me.setup_s3().await?;

        Ok(me)
    }

    async fn setup_sdk(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.devlog_sdk.get_or_init(|| async move {
            DevlogSdk::new(SharingResource {
                smtp_client: self.smtp_pool_request().expect("Smtp client connection failed"),
                s3: self.s3_pool_request().expect("S3 client connection failed"),
                devlog_db: self.devlog_pool_request().expect("Devlog db connection failed"),
            })
        }).await;

        Ok(())
    }

    fn s3_pool_request(&self) -> Result<PoolRequest<S3Connection, ()>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.s3_client.get().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn smtp_pool_request(&self) -> Result<PoolRequest<SmtpTransport, ()>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.smtp_client.get().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn devlog_pool_request(&self) -> Result<PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.devblog_db.get().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    fn devblog_pool_request(&self) -> Result<PoolRequest<SurrealDbConnection, SurrealDbConnectionInfo>, Box<dyn std::error::Error>> {
        let request = PoolRequestBuilder::new()
            .pool(self.devblog_db.get().clone())
            .retreiving_timeout(Duration::new(10, 0))
            .build();

        Ok(request)
    }

    async fn setup_db(&self) -> Result<(), Box<dyn std::error::Error>> {
        let ns = "devblog-api";
        self.devblog_db.get_or_init(|| async move {
            info!(target: ns, "Connecting to devblog database");
            PoolBuilder::new(crate::config::CONFIGS.surreal_db.clone())
                .min_pool_size(10)
                .max_pool_size(100)
                .build().await
        }).await;

        self.devlog_db.get_or_init(|| async move {
            info!(target: ns, "Connecting to devlog database");
            PoolBuilder::new(devlog_sdk::config::CONFIGS.surrealdb.clone())
                .min_pool_size(10)
                .max_pool_size(100)
                .build().await
        }).await;

        Ok(())
    }

    async fn setup_s3(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.s3_client.get_or_init(|| async move {
            PoolBuilder::new(())
                .min_pool_size(5)
                .max_pool_size(1000)
                .cleanup(CleanupStrategy::Best { interval: Duration::new(100, 0), min_pool_size: 5 })
                .build()
                .await
        }).await;

        Ok(())
    }

    async fn s3_client(&self) -> Result<S3Client, Box<dyn std::error::Error>> {
        Ok(S3Client {
            client: self.s3_pool_request()?
        })
    }

    async fn smtp_client(&self) -> Result<SmtpClient, Box<dyn std::error::Error>> {
        Ok(SmtpClient {
            transport: self.smtp_pool_request()?
        })
    }

    pub fn new_discussion_service(&self) -> impl NewDiscussionService {
        DiscussionService {
            db: self.devblog_pool_request().expect("devblog db connection failed"),
            s3: self.s3_pool_request().expect("S3 connection failed"),
        }
    }

    pub fn (&self) -> impl  {
        AuthenticationGrpcService {

        }
    }
}

