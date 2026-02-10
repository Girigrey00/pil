export interface UploadRequestPayload {
  cas_id: string;
  document_path: string[];
  username: string;
}

export interface UploadResponsePayload {
  status: 'success' | 'failed';
  cas_id: string;
  report_path?: string;
  download_url?: string;
  error_message?: string;
}

export interface HistoryItem {
  id: number;
  user_id: string;
  cas_id: string;
  status: 'complete' | 'fail';
  summary: string;
  total_files: number;
  accepted_files: number;
  latency_ms: number;
  created_at: string;
  download_url: string;
}

export interface HistoryResponse {
  status: string;
  Total_Count: number;
  Rejected: number;
  data: HistoryItem[];
}

export interface User {
  name?: string;
  username: string;
  role?: string;
}