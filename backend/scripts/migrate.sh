#!/bin/bash
# Render Database Migration Script
# Run this after deploying to Render to set up the database

echo "🔧 Running database migrations..."

# Connect to Render PostgreSQL and run schema
psql $DATABASE_URL -f backend/database/schema.sql

echo "✅ Database migration completed!"
