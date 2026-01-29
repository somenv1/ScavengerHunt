# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A romantic GPS-based scavenger hunt web app that guides users through 6 locations in Brussels, revealing memories and clues at each stop. The app uses the Geolocation API to track proximity to destinations.

## Running the App

```bash
# HTTPS server (required for GPS to work)
python server.py
# Opens at https://localhost:8443

# Alternative HTTP server (GPS may not work)
python -m http.server 8000
```

The HTTPS server auto-generates self-signed certificates (`cert.pem`, `key.pem`) if they don't exist.

## Architecture

This is a single-page application with no build step:

- **index.html** - App structure with 4 screens: welcome, hunt, success, final
- **app.js** - Core logic: GPS tracking, location validation, skip codes, screen transitions
- **styles.css** - Pink/rose themed CSS with CSS variables for theming
- **server.py** - Python HTTPS server for local development

### Key Data Structures (app.js)

- `locations[]` - Array of 6 location objects with coords, radius, clues, and memories
- `skipCodes{}` - Map of location numbers to bypass codes
- `settings{}` - App configuration (showMapsButton, minRadius)

### GPS Flow

1. `startGPSTracking()` begins watching position
2. `onPositionUpdate()` calculates distance via Haversine formula
3. `updateDistanceDisplay()` updates UI and enables arrival button when within radius
4. Each location has a custom radius (80-100m)

### Skip Code Feature

Tap "Location #" text 3 times to reveal code input. Codes bypass GPS and jump to any location's success screen.

## Customization Points

- Location data: `locations` array in `app.js:23-96`
- Skip codes: `skipCodes` object in `app.js:13-20`
- Theme colors: CSS variables in `styles.css:6-38`
- GPS radius per location: `radius` property in each location object
