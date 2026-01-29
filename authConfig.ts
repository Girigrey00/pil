import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        // TODO: Replace with your actual Client ID from Azure Portal
        clientId: "ENTER_YOUR_CLIENT_ID_HERE", 
        // TODO: Replace with your actual Tenant ID or "common"
        authority: "https://login.microsoftonline.com/ENTER_YOUR_TENANT_ID_HERE", 
        // Must match the Redirect URI registered in Azure Portal
        redirectUri: window.location.origin, 
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

// Configuration for your Backend API
export const apiConfig = {
    // Updated to the provided production endpoint
    baseUrl: "https://pil.gernas.bankfab.com/api",
    // TODO: If your API requires a specific scope (e.g. api://<client_id>/access_as_user), add it here.
    scopes: ["User.Read"]
};