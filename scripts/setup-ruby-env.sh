#!/bin/bash

# Ruby Environment Setup Script for kitzy.github.io
# This script ensures the proper Ruby environment is configured before running commands

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "[${YELLOW}INFO${NC}] $1"
}

print_success() {
    echo -e "[${GREEN}SUCCESS${NC}] $1"
}

print_error() {
    echo -e "[${RED}ERROR${NC}] $1"
}

print_status "Setting up Ruby environment..."

# Setup Homebrew
if command -v /opt/homebrew/bin/brew >/dev/null 2>&1; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    print_success "Homebrew environment loaded"
else
    print_error "Homebrew not found at /opt/homebrew/bin/brew"
    exit 1
fi

# Setup rbenv
if command -v rbenv >/dev/null 2>&1; then
    eval "$(rbenv init -)"
    print_success "rbenv initialized"
else
    print_error "rbenv not found in PATH"
    exit 1
fi

# Verify Ruby version
EXPECTED_RUBY="3.2.9"
CURRENT_RUBY=$(ruby -v | grep -o '3\.[0-9]\+\.[0-9]\+')

if [[ "$CURRENT_RUBY" == "$EXPECTED_RUBY" ]]; then
    print_success "Ruby $EXPECTED_RUBY is active"
else
    print_error "Expected Ruby $EXPECTED_RUBY, but found $CURRENT_RUBY"
    print_status "Run 'rbenv install $EXPECTED_RUBY && rbenv local $EXPECTED_RUBY'"
    exit 1
fi

# Verify Bundler
if command -v bundler >/dev/null 2>&1; then
    BUNDLER_VERSION=$(bundler version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
    print_success "Bundler $BUNDLER_VERSION is available"
else
    print_error "Bundler not found"
    exit 1
fi

print_success "Ruby environment is properly configured!"
print_status "Ruby: $(ruby -v)"
print_status "Bundler: $(bundler version)"
print_status "Gems location: $(gem env gemdir)"

# If arguments were passed, execute them with the proper environment
if [[ $# -gt 0 ]]; then
    print_status "Executing: $*"
    exec "$@"
fi