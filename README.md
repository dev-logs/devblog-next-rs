# Devblog Written in Next JS (Web) and Rust (Backend)

## Structure:

Define API schema, backend and frontend will communicate under gRPC
```sh
└── schema
│     ├── Rust           # Module for compiled schema for Rust
│     ├── Typescript     # Module for compiled schema for Typescript project, support both web gRPC and native gRPC 
│     │
├── api                  # Api written in Rust and communicate via gRPC
│      
├── web                  # website
│     ├── content   # Define the blog post in mdx, the blog will then being migrated to database automatically.

```
### Web
Install dependencies:
```
cd web; yarn install
```
Dev environment:
```
yarn dev
```
Production:
```
yarn build
yarn start
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

