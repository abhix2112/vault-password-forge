# Use Rust official image as builder
FROM rust:latest AS builder

WORKDIR /app

# Copy Cargo files first to leverage Docker cache
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Build the Rust application in release mode
RUN cargo build --release

# Use a minimal image for the final build
FROM debian:bullseye-slim

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/vault-password-forge /app/vault-password-forge

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["/app/vault-password-forge"]
