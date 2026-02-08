#!/bin/bash
# Download images for Algocdk landing page
# Run this script to download all images from Unsplash

cd "$(dirname "$0")/images"

# Hero backgrounds
curl -o hero-bg-1.jpg "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80"
curl -o hero-bg-2.jpg "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1920&q=80"
curl -o hero-bg-3.jpg "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920&q=80"
curl -o hero-bg-4.jpg "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
curl -o hero-bg-5.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"

# Forex charts
curl -o forex-chart-1.jpg "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=180&fit=crop&q=80"
curl -o forex-chart-2.jpg "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=180&fit=crop&q=80"
curl -o forex-chart-3.jpg "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=180&fit=crop&q=80"

# Bot containers
curl -o bot-momentum.jpg "https://images.unsplash.com/photo-1581091870627-3d5b28d47d8b?auto=format&fit=crop&w=1600&q=80"
curl -o bot-breakout.jpg "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1600&q=80"
curl -o bot-statistical.jpg "https://images.unsplash.com/photo-1593376893114-1aed528d80cf?auto=format&fit=crop&w=1600&q=80"

echo "All images downloaded successfully!"
