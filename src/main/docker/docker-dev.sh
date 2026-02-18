#!/usr/bin/env bash

# Get parameter from bash cmd "up" placeholder
ACTION=${1:-up}  # Default to "up" if no argument is provided

if [ "$ACTION" = "up" ]; then
    echo "Starting development environment..."
    # Call the up script
    bash ./scripts/up.sh
elif [ "$ACTION" = "down" ]; then
    echo "Stopping development environment..."
    # Call the down script
    bash ./scripts/down.sh
elif [ "$ACTION" = "status" ]; then
    # Call the status script
    bash ./scripts/status.sh
else
    echo "Usage: $0 [up|down|status]"
    echo ""
    echo "Commands:"
    echo "  up      - Start all services"
    echo "  down    - Stop all services"
    echo "  status  - Check service status"
    exit 1
fi
