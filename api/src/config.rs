use core_services::db::SurrealDbConnectionInfo;
use lazy_static::lazy_static;
use std::env;

#[derive(Debug)]
pub struct GRPCServer {
    pub port: u16,
    pub web_port: u16,
    pub cors: Vec<String>
}

impl Default for GRPCServer {
    fn default() -> Self {
        let cors_string: String = env::var("DEVLOG_DEVBLOG_CORS")
            .map(|env_var| env_var.parse().expect("DEVLOG_DEVBLOG_CORS must be string"))
            .unwrap_or("http://localhost:3000;".to_string());

        let cors: Vec<String> = cors_string.split(";").into_iter().map(|it| it.to_string()).collect();

        Self {
            port: env::var("DEVLOG_DEVBLOG_API_GRPC_PORT")
                .map(|env_var| env_var.parse().expect("The DEVLOG_DEVBLOG_API_GRPC_PORT must be number"))
                .unwrap_or(30001),
            web_port: env::var("DEVLOG_DEVBLOG_GRPC_WEB_PORT")
                .map(|env_var| env_var.parse().expect("The DEVLOG_DEVBLOG_API_GRPC_WEB_PORT must be number"))
                .unwrap_or(30002),
            cors
        }
    }
}

#[derive(Debug)]
pub struct PostMigrate {
    pub bumped_folder_path: String
}

impl Default for PostMigrate {
    fn default() -> Self {
        Self {
            bumped_folder_path: env::var("DEVLOG_DEVBLOG_POST_BUMPED_FOLDER_PATH")
                .map(|env_var| env_var.parse().expect("DEVLOG_DEVBLOG_POST_BUMPED_FOLDER_PATH must be string"))
                .unwrap_or("./bumped".to_owned())
        }
    }
}

#[derive(Debug)]
pub struct Config {
    pub surreal_db: SurrealDbConnectionInfo,
    pub grpc_server: GRPCServer,
    pub post_migrate: PostMigrate
}

impl Default for Config {
    fn default() -> Self {
        Self {
            post_migrate: Default::default(),
            grpc_server: Default::default(),
            surreal_db: SurrealDbConnectionInfo {
                namespace: env::var("DEVLOG_SURREAL_DB_NAMESPACE").unwrap_or("dev".to_owned()),
                socket_address: env::var("DEVLOG_SURREAL_DB_SOCKET_ADDRESS").unwrap_or("127.0.0.1:8000".to_owned()),
                db_name: env::var("DEVLOG_DEVBLOG_SURREAL_DB_NAME").unwrap_or("devblog".to_owned()),
                db_username: env::var("DEVLOG_DEVBLOG_SURREAL_DB_USERNAME").unwrap_or("root".to_owned()),
                db_password: env::var("DEVLOG_DEVBLOG_SURREAL_DB_PASSWORD").unwrap_or("root".to_owned())
            }
        }
    }
}

lazy_static! {
    pub static ref CONFIGS: Config = Default::default();
}
