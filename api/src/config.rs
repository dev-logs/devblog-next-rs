use lazy_static::lazy_static;
use std::env;

#[derive(Debug)]
pub struct GRPCServer {
    pub port: u16,
    pub web_port: u16
}

impl Default for GRPCServer {
    fn default() -> Self {
        Self {
            port: env::var("DEVLOGS_DEVBLOG_API_GRPC_PORT")
                .map(|env_var| env_var.parse().expect("The DEVLOGS_DEVBLOG_API_GRPC_PORT must be number"))
                .unwrap_or(30001),
            web_port: env::var("DEVLOGS_DEVBLOG_GRPC_WEB_PORT")
                .map(|env_var| env_var.parse().expect("The DEVLOGS_DEVBLOG_API_GRPC_WEB_PORT must be number"))
                .unwrap_or(30002),
        }
    }
}

#[derive(Debug)]
pub struct SurrealDb {
    pub socket_address: String,
    /// https://surrealdb.com/docs/surrealql/statements/define/namespace
    pub namespace: String,
    pub db_name: String,
    pub db_password: String,
    pub db_username: String,
}

impl Default for SurrealDb {
    fn default() -> Self {
        SurrealDb {
            socket_address: env::var("DEVLOGS_SURREAL_DB_SOCKET_ADDRESS").unwrap_or("127.0.0.1:8000".to_owned()),
            db_name: env::var("DEVLOGS_SURREAL_DB_NAME").unwrap_or("devblog".to_owned()),
            namespace: env::var("DEVLOGS_SURREAL_DB_NAMESPACE").unwrap_or("dev".to_owned()),
            db_username: env::var("DEVLOGS_SURREAL_DB_USERNAME").unwrap_or("root".to_owned()),
            db_password: env::var("DEVLOGS_SURREAL_DB_PASSWORD").unwrap_or("root".to_owned()),
        }
    }
}

#[derive(Debug, Default)]
pub struct Config {
    pub surreal_db: SurrealDb,
    pub grpc_server: GRPCServer
}

lazy_static! {
    pub static ref CONFIGS: Config = Default::default();
}
