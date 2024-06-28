use core_services::services::base::Service;

use crate::Db;

pub struct SignupService {
    db: Db
}

pub enum SignupParams {
    user
}

impl Service<
