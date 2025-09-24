#!/bin/bash

# Dependency Management Script for kitzy.github.io
# This script helps maintain dependencies with security emphasis
# Usage: ./scripts/update-deps.sh [options]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
SECURITY_ONLY=false
DRY_RUN=false
VERBOSE=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_help() {
    cat << EOF
Dependency Management Script

Usage: $0 [OPTIONS]

OPTIONS:
    -s, --security-only    Only check and update security vulnerabilities
    -d, --dry-run         Show what would be updated without making changes
    -v, --verbose         Show detailed output
    -h, --help           Show this help message

EXAMPLES:
    $0                    # Full dependency update and security check
    $0 --security-only    # Only security updates
    $0 --dry-run          # Preview what would be updated
    $0 -sv                # Security-only with verbose output

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--security-only)
            SECURITY_ONLY=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if we're in the right directory
if [[ ! -f "Gemfile" ]]; then
    print_error "Gemfile not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting dependency management for kitzy.github.io"
echo "Security-only: $SECURITY_ONLY | Dry-run: $DRY_RUN | Verbose: $VERBOSE"
echo

# Install bundle-audit if not available
if ! gem list bundle-audit -i > /dev/null 2>&1; then
    print_status "Installing bundle-audit..."
    gem install bundle-audit
fi

# Update vulnerability database
print_status "Updating vulnerability database..."
bundle audit update

# Run security audit
print_status "Running security audit..."
# Uses .bundler-audit.yml to temporarily ignore google-protobuf CVE-2024-7254 until Ruby can be updated to 2.7+
if bundle audit check; then
    print_success "No known security vulnerabilities found (excluding known google-protobuf issue)!"
else
    print_error "Security vulnerabilities detected!"
    if [[ "$SECURITY_ONLY" == "true" ]]; then
        print_warning "Use 'bundle update --conservative' to update vulnerable gems"
        exit 1
    fi
fi

echo

# If security-only mode, exit here
if [[ "$SECURITY_ONLY" == "true" ]]; then
    print_status "Security-only mode completed."
    exit 0
fi

# Check for outdated dependencies
print_status "Checking for outdated dependencies..."
outdated_gems=$(bundle outdated --parseable 2>/dev/null || true)

if [[ -n "$outdated_gems" ]]; then
    print_warning "Outdated dependencies found:"
    echo "$outdated_gems" | while read -r line; do
        if [[ -n "$line" ]]; then
            echo "  - $line"
        fi
    done
    echo
else
    print_success "All dependencies are up to date!"
    exit 0
fi

# Update dependencies
if [[ "$DRY_RUN" == "true" ]]; then
    print_status "DRY RUN: Would run 'bundle update'"
    print_status "DRY RUN: Would run security audit again"
else
    print_status "Updating dependencies..."
    
    if [[ "$VERBOSE" == "true" ]]; then
        bundle update
    else
        bundle update > /dev/null 2>&1
    fi
    
    print_success "Dependencies updated!"
    
    # Run security audit again after updates
    print_status "Running security audit after updates..."
    if bundle audit check; then
        print_success "No security vulnerabilities after updates (excluding known google-protobuf issue)!"
    else
        print_error "Security vulnerabilities still exist after updates!"
        print_warning "Manual intervention may be required."
        exit 1
    fi
fi

# Generate dependency report
print_status "Generating dependency report..."
report_file="dependency-report-$(date +%Y%m%d-%H%M%S).txt"

if [[ "$DRY_RUN" == "false" ]]; then
    {
        echo "Dependency Report - $(date)"
        echo "================================"
        echo
        echo "Ruby Version:"
        ruby --version
        echo
        echo "Bundler Version:"
        bundle --version
        echo
        echo "Installed Gems:"
        bundle list
        echo
        echo "Security Audit:"
        bundle audit check || echo "Vulnerabilities found - see above"
    } > "$report_file"
    
    print_success "Dependency report saved to: $report_file"
else
    print_status "DRY RUN: Would generate dependency report: $report_file"
fi

echo
print_success "Dependency management completed successfully!"

# Suggest next steps
echo
print_status "Suggested next steps:"
echo "  1. Review the changes with 'git diff'"
echo "  2. Test your site with 'bundle exec jekyll serve'"
echo "  3. Commit and push changes if everything looks good"
if [[ "$DRY_RUN" == "false" ]]; then
    echo "  4. Review dependency report: $report_file"
fi