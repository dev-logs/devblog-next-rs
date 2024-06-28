use core_services::services::base::{Resolve, Service};
use schema::devlog::entities::User;

use crate::Db;

pub struct SigninService {
    db: Db
}

#[derive(Debug)]
pub enum SigninParams {
    EmailPassword(String, String),
    AccessToken(String)
}

impl Service<SigninParams, User> for SigninService {
    async fn execute(self, params: SigninParams) -> Resolve<User> {
        match params {
            SigninParams::EmailPassword(email, password) => {

            },
            SigninParams::AccessToken(_) => {

            },
        }
    }
}
