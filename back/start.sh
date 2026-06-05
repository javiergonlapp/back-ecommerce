#!/bin/sh
echo "🔍 Checking if seed is needed..."
node src/scripts/seed.js
echo "🚀 Starting server..."
exec node src/server.js
