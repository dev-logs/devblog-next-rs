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

### To compiling Rust faster:
- I have use new linker call *mold* [https://github.com/bluewhalesystems/sold?tab=readme-ov-file] if you need to apply to your target, you need to install it, or if you don't like it, just simply remove file `api/.cargo/config.toml`

## Environment variables:
```
export DEVLOG_DEVBLOG_API_URL='http://localhost:30001'
```
