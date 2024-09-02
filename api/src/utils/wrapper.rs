use std::ops::Deref;

#[derive(Clone,)]
pub struct W<T,>(T,)
where
    T: Clone;

impl<T,> Deref for W<T,>
where
    T: Clone,
{
    type Target = T;

    fn deref(&self,) -> &Self::Target {
        &self.0
    }
}
