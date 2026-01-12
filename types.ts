export interface FilePayloadItem {
  file_name: string;
  content_type: string;
  source: 'binary_upload';
}

export interface UploadRequestPayload {
  cas_id: string;
  files: FilePayloadItem[];
}

export interface UploadResponsePayload {
  status: string;
  cas_id: string;
  report_path: string;
  download_url: string;
}

export interface HistoryItem extends UploadResponsePayload {
  id: string; // Internal ID for React keys
  timestamp: string;
}

export interface User {
  username: string;
  role: 'admin';
}
