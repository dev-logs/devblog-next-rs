#![feature(trait_alias)]
pub mod grpc;
pub mod config;
pub mod services;
mod utils;
mod di;
mod repository;

use std::{sync::Arc, time::Duration};

use core_services::{
    db::{SurrealDbConnection, SurrealDbConnectionInfo}, grpc::middle::response_handler::ResponseHeaderHandler, logger, s3::S3Client, utils::{pool::allocator::PoolAllocator, pool_allocator::{PoolAllocator, PoolRequest}}
};
use devlog_sdk::{grpc::middleware::auth::AuthInterceptor, sdk::{DevlogSdk, SurrealDbConnection}};
use di::ApiDependenciesInjection;
use grpc::{
    authentication::AuthenticationGrpcService,
    base::GRPCService,
    discussion::DiscussionGrpcService,
    post::PostGrpcServer
};
use tokio::sync::OnceCell;
use tonic_middleware::{InterceptorFor, MiddlewareLayer};
use tower_http::cors::*;

use config::CONFIGS;
use tonic::transport::Server;
use log::info;
use tonic_web::*;
use schema::devlog::{
    self, devblog::rpc::{
        devblog_discussion_service_server::DevblogDiscussionServiceServer,
        post_service_server::PostServiceServer
    }, rpc::authentication_service_server::AuthenticationServiceServer
};

pub static DEVLOG_SDK: OnceCell<DevlogSdk> = OnceCell::const_new();
pub static DI: OnceCell<ApiDependenciesInjection> = OnceCell::const_new();

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    DI.get_or_init(|| async move {
        ApiDependenciesInjection::new().await.expect("Failed to initialize dependencies")
    }).await;

    logger::setup();
    setup_grpc_server().await?;

    Ok(())
}

type DevblogPool = Arc<PoolAllocator<SurrealDbConnection, SurrealDbConnectionInfo>>;
type DevlogPool = Arc<PoolAllocator<SurrealDbConnection, SurrealDbConnectionInfo>>;
type S3ConnectionPool = Arc<PoolAllocator<core_services::S3Connection, ()>>;
type SmtpTransportPool = Arc<PoolAllocator<core_services::SmtpTransport, ()>>;

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

