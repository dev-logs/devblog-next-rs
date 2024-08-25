use crate::DB;

use super::base::GRPCService;
use core_services::{
    s3::S3Client,
    smtp::client::SmtpClient,
    services::base::*
};
use devlog_sdk::services::{signin::SigninService, signup::SignupService, token::TokenService};
use schema::devlog::rpc::{
    authentication_service_server::AuthenticationService, SigninRequest, SigninResponse,
    SignupRequest, SignupResponse,
};
use tonic::{Request, Response, Status};

#[derive(Debug, Clone)]
pub struct AuthenticationGrpcService {}

impl GRPCService for AuthenticationGrpcService {
    fn new() -> Self {
        Self {}
    }
}

#[tonic::async_trait]
impl AuthenticationService for AuthenticationGrpcService {
    async fn signin(
        &self,
        request: Request<SigninRequest>,
    ) -> Result<Response<SigninResponse>, Status> {
        let request = request.get_ref();
        let service = SigninService {
            db: DB.clone(),
            s3: S3Client::new().await,
            token_service: TokenService {},
        };

        let result = service.execute(request.signin.as_ref().unwrap()).await?;

        let res = Response::new(SigninResponse {
            access_token: Some(result.token),
            user: Some(result.user),
        });

        Ok(res)
    }

    async fn signup(
        &self,
        request: Request<SignupRequest>,
    ) -> Result<Response<SignupResponse>, Status> {
        let request = request.get_ref();
        let s3 = S3Client::new().await;
        let smtp_client = SmtpClient::new();
        let service = SignupService {
            s3,
            db: DB.clone(),
            smtp_client,
            token_service: TokenService {}
        };

        let result = service.execute(request.signup.as_ref().unwrap()).await?;

        Ok(Response::new(SignupResponse {
            access_token: Some(result.token),
            user: Some(result.user),
        }))
    }
}
