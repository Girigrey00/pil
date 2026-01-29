import { UploadRequestPayload, UploadResponsePayload, HistoryItem } from '../types';
import { apiConfig } from '../authConfig';

const getHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Hardcoded Azure Blob Storage Configuration
const AZURE_CONTAINER_URL = "https://auranpunawlsa.blob.core.windows.net/pil-beta-latest";
const AZURE_SAS_TOKEN = "?sp=racw&st=2026-01-21T11:37:39Z&se=2026-12-31T19:52:39Z&spr=https&sv=2024-11-04&sr=c&sig=tiAAggE%2BeriqVfvn0RlypXL3JsKP6wy%2B%2BR9WoZjj0d0%3D";

// 1. Direct PUT to Azure Blob Storage using the provided SAS Token
export const uploadFileToAzure = async (relativePath: string, file: File): Promise<void> => {
  // Construct the full URL: Container + Path + SAS Token
  const fullUploadUrl = `${AZURE_CONTAINER_URL}/${relativePath}${AZURE_SAS_TOKEN}`;

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
export const fetchHistory = async (token: string): Promise<HistoryItem[]> => {
  // Assuming the history endpoint follows the same base URL pattern
  const response = await fetch(`${apiConfig.baseUrl}/requests-history`, {
    method: 'GET',
    headers: getHeaders(token)
  });

  if (!response.ok) {
    // Fallback/Graceful handling if history endpoint isn't ready
    console.warn("History endpoint might not be available yet:", response.statusText);
    return []; 
    // throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
};