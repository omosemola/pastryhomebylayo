/**
 * API Configuration
 * Automatically switches between local and production API URLs
 */
const CONFIG = {
    // Default to localhost for development
    // AUTOMATIC SWITCHING:
    // If we are on localhost, use localhost:5000
    // If we are on Netlify (or anywhere else), use the Render URL
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://pastryhome-backend.onrender.com/api' // Placeholder - User will verify this URL
};

// Expose strictly what's needed
const API_URL = CONFIG.API_URL;
