use tonic::{Request, Response, Status};
use tonic::transport::Service;

struct AuthMiddleware<S> {
    service: S,
    secret: String,
}

impl<S> AuthMiddleware<S> {
    fn new(service: S, secret: String) -> Self {
        Self { service, secret }
    }
}

impl<S> Service<Request<()>> for AuthMiddleware<S>
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = S::Future;

    async fn call(&mut self, mut req: Request<()>) {
        let token = req.metadata().get("authorization").and_then(|t| t.to_str().ok());

        if let Some(token) = token {
            match validate_token(token, &self.secret) {
                Ok(user) => {
                    // Insert user information into the request extensions
                    req.extensions_mut().insert(user);
                    self.service.call(req)
                }
                Err(_) => {
                    // Return an unauthorized status if token validation fails
                    Box::pin(async { Err(Status::unauthenticated("Invalid token")) })
                }
            }
        } else {
            Box::pin(async { Err(Status::unauthenticated("No token")) })
        }
    }
}
