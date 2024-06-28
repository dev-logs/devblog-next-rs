use core_services::services::{base::{Resolve, Service}, errors::Errors};
use schema::devlog::entities::{Token, User, UserId};
use surreal_derive_plus::surreal_quote;

use crate::Db;

pub struct SignupService {
    db: Db
}

#[derive(Debug, Clone)]
pub enum SignupParams {
    ByEmail(String),
    ByEmailPassword(String, String),
    ByDisplayName(String)
}

impl Service<SignupParams, Token> for SignupService {
    async fn execute(self, params: SignupParams) -> Resolve<Token> {
        let email: Option<&String> = match &params {
            SignupParams::ByEmail(email) => Some(email),
            SignupParams::ByEmailPassword(email, _) => Some(email),
            _ => None
        };

        let existing_user: Option<User> = match email {
            Some(email) => {
                let user_id = UserId {email: email.clone()};
                self.db.query(surreal_quote!("SELECT * FROM #val(&user_id)")).await?.take(0)?
            }
            None => None
        };

        if existing_user.is_some() {
            return Err(Errors::UserAlreadyExist(email.unwrap().clone()));
        }

        let new_user = match params {
            SignupParams::ByEmail(email) => {
                let user_id = UserId { email: email.clone() };
                User { id: Some(user_id), name: "".to_owned(), email, password: "".to_owned() }
            },
            SignupParams::ByEmailPassword(email, password) => {
                let user_id = UserId { email: email.clone() };
                User { id: Some(user_id), name: "".to_owned(), email, password }
            },
            SignupParams::ByDisplayName(name) => {
                // This is all about the business :((
                let email = format!("{}@no-email.com", name);
                let user_id = UserId { email: email.clone() };
                User { id: Some(user_id), name, email, password: "".to_owned() }
            },
        };

        let created_user: Option<User> = self.db.query(surreal_quote!("CREATE #record(&new_user)")).await?.take(0)?;

        Ok(created_user.unwrap())
    }
}
