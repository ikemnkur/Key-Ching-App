#!/bin/bash

echo "🚀 Setting up KeyChingDB MySQL Database"
echo "======================================"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "   Ubuntu/Debian: sudo apt install mysql-server"
    echo "   macOS: brew install mysql"
    echo "   Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ MySQL found"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your MySQL credentials"
    echo "   Especially update DB_PASSWORD with your MySQL password"
fi

echo "🗄️  Creating KeyChingDB database..."
echo "   You may need to enter your MySQL root password"

mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS KeyChingDB;
USE KeyChingDB;
SOURCE KeyChingDB.sql;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
    echo ""
    echo "🏃 Ready to start the server:"
    echo "   node server.cjs"
    echo ""
    echo "📋 Make sure to:"
    echo "   1. Update .env with correct MySQL credentials"
    echo "   2. Start the server: node server.cjs"
    echo "   3. Test the API: http://localhost:3001/api/userData"
else
    echo "❌ Failed to create database. Please check your MySQL installation and credentials."
fi