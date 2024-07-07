use crate::DB;

use super::base::GRPCService;
use core_services::services::{
    base::Service, signin::SigninService, signup::SignupService, token::TokenService,
};
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
            token_service: TokenService {},
        };

        let token = service.execute(request.signin.as_ref().unwrap()).await?;
        let res = Response::new(SigninResponse {
            access_token: Some(token),
            user: None,
        });

        Ok(res)
    }

    async fn signup(
        &self,
        request: Request<SignupRequest>,
    ) -> Result<Response<SignupResponse>, Status> {
        let request = request.get_ref();
        let service = SignupService {
            db: DB.clone(),
            token_service: TokenService {},
        };

        let token = service.execute(request.signup.as_ref().unwrap()).await?;

        Ok(Response::new(SignupResponse {
            access_token: Some(token),
            user: None,
        }))
    }
}
