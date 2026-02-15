#!/bin/bash
# Load tool paths
export PATH="/home/tega/.local/share/solana/install/active_release/bin:/home/tega/.avm/bin:/home/tega/.cargo/bin:$PATH"

# Move to the anchor directory
cd "$(dirname "$0")"

# Build the program
anchor build
