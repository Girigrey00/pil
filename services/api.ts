import { UploadRequestPayload, UploadResponsePayload, HistoryResponse } from '../types';
import { apiConfig } from '../authConfig';

const getHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Azure Configuration
const AZURE_ACCOUNT_BASE = "https://auranpunawlsa.blob.core.windows.net";
const CONTAINER_NAME = "pil-beta-latest";
const AZURE_SAS_TOKEN = "?sp=racw&st=2026-01-21T11:37:39Z&se=2026-12-31T19:52:39Z&spr=https&sv=2024-11-04&sr=c&sig=tiAAggE%2BeriqVfvn0RlypXL3JsKP6wy%2B%2BR9WoZjj0d0%3D";

// Determine if we are running in development mode (provided by Vite)
const IS_DEV = (import.meta as any).env.DEV;

// Use the proxy path '/azure-blob' in dev, or the full URL in production
const BASE_STORAGE_URL = IS_DEV ? '/azure-blob' : AZURE_ACCOUNT_BASE;

// 1. Direct PUT to Azure Blob Storage using the provided SAS Token
export const uploadFileToAzure = async (relativePath: string, file: File): Promise<void> => {
  // Construct the full URL: Base (Proxy/Real) + Container + Path + SAS Token
  // Example Dev: /azure-blob/pil-beta-latest/cas-id/file.pdf?sas...
  const fullUploadUrl = `${BASE_STORAGE_URL}/${CONTAINER_NAME}/${relativePath}${AZURE_SAS_TOKEN}`;

  const response = await fetch(fullUploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type || 'application/octet-stream', // Azure requires Content-Type
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Azure Upload Failed: ${response.statusText}`);
  }
};

// 2. Submit Job to Backend
export const processUpload = async (token: string, payload: UploadRequestPayload): Promise<UploadResponsePayload> => {
  const response = await fetch(`${apiConfig.baseUrl}/process-request`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Processing Request Failed: ${response.statusText}`);
  }

  return response.json();
};

// 3. Get Dashboard History
export const fetchHistory = async (token: string): Promise<HistoryResponse> => {
  // Use the proxy path defined in authConfig (usually "/api") to avoid CORS errors.
  // The vite.config.ts proxy will forward this to https://pil.gernas.bankfab.com/api/agent-user-history
  const historyUrl = `${apiConfig.baseUrl}/agent-user-history`;
  console.log("Fetching history from (proxied):", historyUrl);
  
  try {
    const response = await fetch(historyUrl, {
      method: 'GET',
      headers: getHeaders(token)
    });

    // Check if the response content type is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
       console.warn("Received non-JSON response.");
       throw new Error("Response is not JSON");
    }

    if (!response.ok) {
      console.error("History endpoint error:", response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("History data received:", data);
    return data;
    
  } catch (error) {
    console.error("Error fetching history:", error);
    // Return empty structure on error instead of dummy data
    return {
      status: "error",
      Total_Count: 0,
      Rejected: 0,
      data: []
    };
  }
};