#!/bin/bash

echo "🚀 Starting KeyChing API Server"
echo "==============================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found! Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your database credentials before running again."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database file exists
if [ ! -f "KeyChingDB.sql" ]; then
    echo "❌ KeyChingDB.sql not found! Please ensure the database schema file is present."
    exit 1
fi

echo "✅ Starting server..."
npm start