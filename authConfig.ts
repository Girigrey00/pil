// Configuration for your Backend API
export const apiConfig = {
    // Use relative path '/api' so it goes through the Vite proxy in development
    baseUrl: "/api",
    // Scopes are no longer strictly needed on frontend for simple admin login, but kept for reference
    scopes: ["User.Read"]
};