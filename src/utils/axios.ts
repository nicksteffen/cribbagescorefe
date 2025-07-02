// src/utils/axios.ts
import axios from 'axios';

// --- Axios Global Configuration ---
axios.defaults.baseURL = 'https://localhost:5000'; // Your Flask backend URL
axios.defaults.withCredentials = true; // REMOVED: Not needed if not sending/receiving cookies for JWT

// --- Request Interceptor to Add Authorization Header ---
axios.interceptors.request.use(
    config => {
        console.log("intercepting")
        // Get the token from localStorage
        console.log(config)
        const accessToken = localStorage.getItem('access_token');

        // If a token exists and the request is to your backend API
        // (You might want to make this more robust depending on your API structure)
        if (accessToken && config.url && config.url.startsWith('/api/')) {
            // Add the Authorization header
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log("added header")
        }
        else { console.log("missed if")}

        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// --- Export the configured Axios instance ---
export default axios;