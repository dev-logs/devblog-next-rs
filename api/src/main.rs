#![feature(trait_alias)]
pub mod grpc;
pub mod config;
pub mod services;
mod utils;

use std::{sync::Arc, time::Duration};

use core_services::{
    db::{SurrealDbConnection, SurrealDbConnectionInfo}, grpc::middle::response_handler::ResponseHeaderHandler, logger, s3::S3Client, utils::pool_allocator::{PoolAllocator, PoolRequest}
};
use devlog_sdk::{grpc::middleware::auth::AuthInterceptor, sdk::SurrealDbConnection};
use grpc::{
    authentication::AuthenticationGrpcService,
    base::GRPCService,
    discussion::DiscussionGrpcService,
    post::PostGrpcServer
};
use surrealdb::{engine::remote::ws::Ws, opt::auth::{Database, Root}};
use tokio::sync::{Mutex, OnceCell};
use tonic_middleware::{InterceptorFor, MiddlewareLayer};
use tower_http::cors::*;

use config::CONFIGS;
use core_services::config::CONFIGS as CORE_CONFIGS;
use tonic::transport::Server;
use log::info;
use tonic_web::*;
use schema::devlog::{
    self, devblog::rpc::{
        devblog_discussion_service_server::DevblogDiscussionServiceServer,
        post_service_server::PostServiceServer
    }, rpc::authentication_service_server::AuthenticationServiceServer
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let namespace = String::from("devblog-api");
    logger::setup();
    info!(target: namespace.as_str(), "{:?}", *CONFIGS);
    info!(target: namespace.as_str(), "{:?}", *CORE_CONFIGS);

    let (devblog_db, devlog_db) = setup_db().await?;
    let s3_client = setup_s3().await;

    let devlog_db_request = PoolRequest {
        pool: PoolAllocator::new(10, 100, devlog_sdk::config::CONFIGS.surrealdb.clone(), Duration::new(10, 0))
    };

    let sdk = devlog_sdk::sdk::DevlogSdk::new(smtp_client, s3, devlog_db_request);
    setup_grpc_server().await?;

    Ok(())
}

type DevblogPool = OnceCell<Arc<Mutex<PoolAllocator<SurrealDbConnection>>>>;
type DevlogPool = OnceCell<Arc<Mutex<PoolAllocator<SurrealDbConnection>>>>;

async fn setup_db() -> Result<(DevblogPool, DevlogPool), Box<dyn std::error::Error>> {
    let ns = "devblog-api-db";
    let devblog_db: DevblogPool = OnceCell::const_new();
    let devlog_db: DevlogPool = OnceCell::const_new();

    let devblog_db = devblog_db.get_or_init(|| async move {
        info!(target: ns, "Connecting to devblog database");
        let db_pool = PoolAllocator::new(10, 100, CONFIGS.surreal_db.clone(), Duration::new(10, 0));
        Arc::new(Mutex::new(db_pool)) 
    }).await;

    let devlog_db = devlog_db.get_or_init(|| async move {
        info!(target: ns, "Connecting to devlog database");
        let db_pool = PoolAllocator::new(10, 100, devlog_sdk::config::CONFIGS.surrealdb.clone(), Duration::new(10, 0));
        Arc::new(Mutex::new(db_pool)) 
    }).await;

    Ok((devblog_db, devlog_db))
}

async fn setup_s3() -> OnceCell<S3Client> {
    let s3_client: OnceCell<S3Client> = OnceCell::const_new();

    s3_client.get_or_init(|| async move {
        S3Client::new().await
    }).await
}

async fn setup_grpc_server() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-grpc-server";
    let addr = format!("127.0.0.1:{}", CONFIGS.grpc_server.port).parse()?;
    let discussion_service = DiscussionGrpcService::new();
    let authentication_service = AuthenticationGrpcService::new();
    let post_server= PostGrpcServer::new();
    let response_handler = ResponseHeaderHandler {};

    info!(target: ns, "gRPC server starting at {}", &addr);

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_headers(AllowHeaders::any());

    // layer for cors
    Server::builder()
        .accept_http1(true)
        .layer(cors)
        .layer(MiddlewareLayer::new(response_handler))
        .layer(GrpcWebLayer::new())
        .add_service(AuthenticationServiceServer::new(authentication_service))
        .add_service(InterceptorFor::new(
            DevblogDiscussionServiceServer::new(discussion_service),
            AuthInterceptor::new()))
        .add_service(InterceptorFor::new(
            PostServiceServer::new(post_server),
            AuthInterceptor::new()))
        .serve(addr)
        .await?;

    Ok(())
}

