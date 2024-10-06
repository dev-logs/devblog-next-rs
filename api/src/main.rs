pub mod config;
mod di;
pub mod fs;
pub mod grpc;
mod repository;
pub mod services;
mod utils;

use std::sync::Arc;

use core_services::db::{SurrealDbConnection, SurrealDbConnectionInfo};
use core_services::grpc::middle::response_handler::ResponseHeaderHandler;
use core_services::logger;
use core_services::services::base::Service;
use core_services::utils::pool::allocator::PoolAllocator;
use devlog_sdk::sdk::DependenciesInjection;
use di::ApiDependenciesInjection;
use services::post::MigratePostParams;
use tokio::sync::OnceCell;
use tonic_middleware::{InterceptorFor, MiddlewareLayer};
use tower_http::cors::*;

use config::CONFIGS;
use log::info;
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionServiceServer;
use schema::devlog::devblog::rpc::post_service_server::PostServiceServer;
use schema::devlog::rpc::authentication_service_server::AuthenticationServiceServer;
use tonic::transport::Server;
use tonic_web::*;

type DevblogPool = Arc<PoolAllocator<SurrealDbConnection>>;
type DevlogPool = Arc<PoolAllocator<SurrealDbConnection>>;
type S3ConnectionPool = Arc<PoolAllocator<core_services::S3Connection>>;
type SmtpTransportPool = Arc<PoolAllocator<core_services::SmtpTransport>>;

pub static DI: OnceCell<ApiDependenciesInjection> = OnceCell::const_new();

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    logger::setup();
    info!(target: "api", "Starting with environments: {:?} {:?} {:?}", *CONFIGS, *core_services::config::CONFIGS, *devlog_sdk::config::CONFIGS);
    DI.get_or_init(|| async move {
        info!(target: "api", "Initialize dependencies injection");
        ApiDependenciesInjection::new().await.expect("Failed to initialize dependencies")
    })
    .await;

    migrate_post().await?;

    setup_grpc_server().await?;

    Ok(())
}

async fn migrate_post() -> Result<(), Box<dyn std::error::Error>> {
    DI.get().unwrap().migrate_post_service().execute(MigratePostParams {}).await?;
    Ok(())
}

async fn setup_grpc_server() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-grpc-server";
    let addr = format!("0.0.0.0:{}", CONFIGS.grpc_server.port).parse()?;
    let discussion_service = DI.get().unwrap().grpc_discussion_service();
    let authentication_service = DI.get().unwrap().grpc_authentication_service();
    let post_server = DI.get().unwrap().grpc_post_service();
    let response_handler = ResponseHeaderHandler {};

    info!(target: ns, "gRPC server starting at {}", &addr);

    let mut cors = [
        "https://_.com".parse().unwrap(),
        "https://_.com".parse().unwrap(),
        "https://_.com".parse().unwrap(),
        "https://_.com".parse().unwrap(),
        "https://_.com".parse().unwrap(),
        "https://_.com".parse().unwrap(),
    ];

    let origins = CONFIGS.grpc_server.cors.clone();
    for i in 0..origins.len() - 1 {
        cors[i] = origins.get(i).clone().unwrap().parse().unwrap();
    }

    info!(target: "api", "Allowing origin {:?}", cors);
    let cors_layer = CorsLayer::new()
        .allow_origin(cors)
        .allow_headers(AllowHeaders::any());

    // layer for cors
    Server::builder()
        .accept_http1(true)
        .layer(cors_layer)
        .layer(MiddlewareLayer::new(response_handler))
        .layer(GrpcWebLayer::new())
        .add_service(AuthenticationServiceServer::new(authentication_service))
        .add_service(InterceptorFor::new(
            DevblogDiscussionServiceServer::new(discussion_service),
            DI.get().unwrap().devlog_sdk.get().unwrap().get_grpc_middleware_auth()
        ))
        .add_service(InterceptorFor::new(
            PostServiceServer::new(post_server),
            DI.get().unwrap().devlog_sdk.get().unwrap().get_grpc_middleware_auth()
        ))
        .serve(addr)
        .await?;

    Ok(())
}
