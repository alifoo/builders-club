#!/bin/bash
set -e

echo "==> Installing rustup..."
curl https://sh.rustup.rs -sSf | sh -s -- -y

echo "==> Sourcing cargo env..."
export PATH="$HOME/.cargo/bin:$PATH"

echo "==> Rust version:"
rustc --version

echo "==> Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown

echo "==> Installing wasm-pack..."
cargo install wasm-pack

echo "==> Building WASM..."
wasm-pack build --target web

echo "==> WASM build complete! Contents of pkg/:"
ls -la pkg/
