pub mod grpc;
pub mod config;

use grpc::{base::GRPCService, discussion::DiscussionGrpcService};

use config::CONFIGS;
use log::info;
use pretty_env_logger::formatted_timed_builder;
use schema::devblog::devblog::devblog_discussion_service_server::DevblogDiscussionServiceServer;
use tonic::transport::Server;
use tonic_web::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    setup_logger();

    let grpc_server_async_task = setup_grpc_server();
    let grpc_server_web_async_task = setup_grpc_web_server();

    let (server, web) = tokio::join!(grpc_server_async_task, grpc_server_web_async_task);

    server?;
    web?;

    Ok(())
}

async fn setup_grpc_web_server() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-grpc-web-server";
    let addr = format!("[::1]:{}", CONFIGS.grpc_server.web_port).parse()?;
    let discussion_service = DiscussionGrpcService::new();

    info!(target: ns, "Starting grpc web server at {}", addr);
    Server::builder()
           .accept_http1(true)
           .layer(GrpcWebLayer::new())
           .add_service(DevblogDiscussionServiceServer::new(discussion_service))
           .serve(addr)
           .await?;

    Ok(())
}

async fn setup_grpc_server() -> Result<(), Box<dyn std::error::Error>> {
    let ns = "devblog-api-grpc-server";
    let addr = format!("[::1]:{}", CONFIGS.grpc_server.port).parse()?;
    let discussion_service = DiscussionGrpcService::new();

    info!(target: ns, "gRPC server starting at {}", &addr);

    Server::builder()
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
