# Devblog Written in Next JS and Rust

## Coding workflow
### Schema:
Define API schema, backend and frontend will communicate under gRPC
### Web
```
cd web; yarn install
```
```
yarn dev
```
### Api
```
cd api; cargo build
```
```
cargo run
```

## Environment variables:
```
export DEVLOG_DEVBLOG_API_URL='http://localhost:30001'
```
