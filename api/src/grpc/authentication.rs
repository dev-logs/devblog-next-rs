use crate::di::ApiDependenciesInjection;

use core_services::services::base::Service;
use devlog_sdk::sdk::DependenciesInjection;
use schema::devlog::rpc::{
    authentication_service_server::AuthenticationService, SigninRequest, SigninResponse,
    SignupRequest, SignupResponse,
};
use tonic::{Request, Response, Status};

#[derive(Clone)]
pub struct AuthenticationGrpcService {
    di: &'static ApiDependenciesInjection
}

#[async_trait::async_trait]
impl AuthenticationService for AuthenticationGrpcService {
    async fn signin(
        &self,
        request: Request<SigninRequest>,
    ) -> Result<Response<SigninResponse>, Status> {
        let request = request.get_ref();

        let service = self.di.devlog_sdk.get().unwrap().signin_service();
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
        let service = self.di.devlog_sdk.get().unwrap().signup_service();

        let result = service.execute(request.signup.as_ref().unwrap()).await?;

        Ok(Response::new(SignupResponse {
            access_token: Some(result.token),
            user: Some(result.user),
        }))
    }
}

