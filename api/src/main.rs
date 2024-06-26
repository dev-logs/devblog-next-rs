pub mod grpc;
pub mod config;

use grpc::{base::GRPCService, discussion::DiscussionGrpcService};
use surrealdb::{engine::remote::ws::{Client, Ws}, opt::auth::Root, Surreal};
use tower_http::cors::*;

use config::CONFIGS;
use log::info;
use pretty_env_logger::formatted_timed_builder;
use tonic::transport::Server;
use tonic_web::*;
use once_cell::sync::Lazy;
use schema::devlog::devblog::rpc::devblog_discussion_service_server::DevblogDiscussionServiceServer;

type Db = Surreal<Client>;

static DB: Lazy<Db> = Lazy::new(Surreal::init);

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

    info!(target: ns, "gRPC server starting at {}", &addr);

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_headers(AllowHeaders::mirror_request())
        .allow_methods(AllowMethods::mirror_request());

    // layer for cors
    Server::builder()
        .accept_http1(true)
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .add_service(DevblogDiscussionServiceServer::new(discussion_service))
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
