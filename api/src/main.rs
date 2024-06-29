pub mod grpc;
pub mod config;
pub mod services;

use core_services::{grpc::middle::{auth::AuthInterceptor, response_handler::{self, ResponseHeaderHandler}}, DB};
use grpc::{authentication::AuthenticationGrpcService, base::GRPCService, discussion::DiscussionGrpcService};
use surrealdb::{engine::remote::ws::Ws, opt::auth::Root};
use tonic_middleware::{InterceptorFor, MiddlewareFor, MiddlewareLayer};
use tower_http::cors::*;

use config::CONFIGS;
use log::info;
use pretty_env_logger::formatted_timed_builder;
use tonic::transport::Server;
use tonic_web::*;
use schema::devlog::{devblog::rpc::devblog_discussion_service_server::DevblogDiscussionServiceServer, rpc::authentication_service_server::{AuthenticationService, AuthenticationServiceServer}};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    setup_logger();
    setup_db().await?;
    setup_grpc_server().await?;

    Ok(())
}

async fn setup_db() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-db";
    DB.connect::<Ws>(CONFIGS.surreal_db.socket_address.clone()).await.expect("Failed while connecting to surreal db");
    DB.use_ns(CONFIGS.surreal_db.namespace.clone()).use_db(CONFIGS.surreal_db.db_name.clone()).await.unwrap();
    DB.signin(Root {
        username: CONFIGS.surreal_db.db_username.clone().as_str(),
        password: CONFIGS.surreal_db.db_password.clone().as_str()
    }).await.unwrap();

    let db_version = DB.version().await.expect("Failed to get the surreal db version");

    info!(target: &ns, "Connected to SurrealDb version: {} {}", db_version, CONFIGS.surreal_db.socket_address);

    Ok(())
}

async fn setup_grpc_server() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-grpc-server";
    let addr = format!("127.0.0.1:{}", CONFIGS.grpc_server.port).parse()?;
    let discussion_service = DiscussionGrpcService::new();
    let authentication_service = AuthenticationGrpcService::new();
    let response_handler = ResponseHeaderHandler {};

    info!(target: ns, "gRPC server starting at {}", &addr);

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_headers(AllowHeaders::any())
        .allow_methods(AllowMethods::mirror_request());

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
        .serve(addr)
        .await?;

    Ok(())
}

fn setup_logger() {
    let namespace = String::from("devblog-api");
    let mut log_builder = formatted_timed_builder();
    if let Ok(filter_env) = std::env::var("RUST_LOG") {
        log_builder.parse_filters(&filter_env);
    }
    else {
        log_builder.filter(None, log::LevelFilter::Info);
    }

    log_builder.init();
    info!(target: &namespace, "Configs {:?}", *CONFIGS);
}
