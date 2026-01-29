export interface UploadRequestPayload {
  cas_id: string;
  document_path: string[];
}

export interface UploadResponsePayload {
  status: 'success' | 'failed';
  cas_id: string;
  report_path?: string;
  download_url?: string;
  error_message?: string;
}

export interface HistoryItem {
  id: string; // Internal ID for React keys
  cas_id: string;
  status: 'success' | 'failed';
  report_path?: string;
  download_url?: string;
  error_message?: string;
  timestamp: string;
}

export interface User {
  name?: string;
  username: string; // This maps to the 'email' or 'preferred_username' from Azure
  role?: string; // Optional, can be derived from ID Token claims
}