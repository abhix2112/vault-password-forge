# Use Rust official image
FROM rust:latest AS builder

# Set work directory
WORKDIR /app

# Copy files
COPY . .

# Build the Rust app
RUN cargo build --release

# Use a smaller base image
FROM debian:bullseye-slim

# Set work directory
WORKDIR /app

# Copy the compiled binary from builder stage
COPY --from=builder /app/target/release/vault-password-forge /app/

# Expose the port Railway assigns
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD ["/app/vault-password-forge"]
