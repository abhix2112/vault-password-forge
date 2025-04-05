#!/bin/bash

# Navigate to the directory containing the binary
cd "$(dirname "$0")"

# Ensure the binary has execute permissions
chmod +x ./target/release/vault-password-forge

# Run the application
./target/release/vault-password-forge
