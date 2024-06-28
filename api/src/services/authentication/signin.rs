use core_services::services::{base::{Resolve, Service}, errors::Errors, token::{GenerateBy, TokenService}};
use schema::devlog::entities::{Token, User, UserId};
use surreal_derive_plus::surreal_quote;

use crate::{config::CONFIGS, Db};

pub struct SigninService {
    db: Db,
    token_service: TokenService
}

#[derive(Debug, Clone)]
pub enum SigninParams {
    EmailPassword(String, String)
}

impl Service<SigninParams, Token> for SigninService {
    async fn execute(self, params: SigninParams) -> Resolve<Token> {
        match params {
            SigninParams::EmailPassword(email, password) => {
                let user_id = UserId { email: email.clone() };
                let user: Option<User> = self.db.query(surreal_quote!("SELECT * FROM #val(&user_id)")).await?.take(0)?;
                if user.is_none() || user.as_ref().unwrap().password != password {
                    return Err(Errors::UnAuthorized(format!("Incorrect user name or password {}", email.as_str()).to_owned()))
                }

                let token = self.token_service.execute(GenerateBy::User(user.unwrap(), CONFIGS.token.access_token_duration)).await?;

                Ok(token)
            },
            _ => Err(Errors::UnAuthorized("".to_owned()))
        }
    }
}
