import { UploadRequestPayload, UploadResponsePayload, HistoryItem } from '../types';

// 1. Mock Endpoint: Get SAS Token / Upload URL from Backend
export const getUploadUrl = async (fileName: string, contentType: string): Promise<{ upload_url: string, storage_path: string }> => {
  console.log(`[API] Requesting SAS Token for: ${fileName}`);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Mock returning a secure Azure Blob URL
  const uniqueId = Math.random().toString(36).substring(7);
  return {
    upload_url: `https://mockstorage.blob.core.windows.net/uploads/${uniqueId}/${fileName}?sas_token=mock_signature`,
    storage_path: `uploads/${uniqueId}/${fileName}`
  };
};

// 2. Mock Endpoint: Direct PUT to Azure Blob Storage
export const uploadFileToAzure = async (uploadUrl: string, file: File): Promise<void> => {
  console.log(`[Azure] Uploading ${file.name} to ${uploadUrl}`);
  
  // In a real app, this would be:
  /*
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type
    },
    body: file
  });
  */

  // Simulate upload time based on file size (mocking 300ms per "chunk")
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`[Azure] Upload Complete: ${file.name}`);
};

// 3. Mock Endpoint: Submit Job to Backend
export const processUpload = async (payload: UploadRequestPayload): Promise<UploadResponsePayload> => {
  console.log('--- Submitting Job to Backend ---');
  console.log(JSON.stringify(payload, null, 2));

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response
  return {
    status: "success",
    cas_id: payload.cas_id,
    report_path: `${payload.cas_id}_final_report.csv`,
    download_url: `/agent/download-report?path=${payload.cas_id}_final_report.csv`
  };
};

// 4. Mock Endpoint: Get Dashboard History
export const fetchHistory = async (): Promise<HistoryItem[]> => {
  console.log('[API] Fetching Request History...');
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

  // Return some dummy historical data
  return [
    {
      id: 1,
      user_id: 'admin_user',
      cas_id: 'CAS-2024-001',
      status: 'complete',
      summary: 'Report generated successfully',
      total_files: 10,
      accepted_files: 10,
      latency_ms: 1200,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      download_url: '#'
    },
    {
      id: 2,
      user_id: 'admin_user',
      cas_id: 'CAS-2024-002',
      status: 'complete',
      summary: 'Report generated successfully',
      total_files: 5,
      accepted_files: 5,
      latency_ms: 850,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      download_url: '#'
    },
    {
      id: 3,
      user_id: 'admin_user',
      cas_id: 'CAS-2024-003',
      status: 'complete',
      summary: 'Report generated successfully',
      total_files: 8,
      accepted_files: 8,
      latency_ms: 920,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      download_url: '#'
    }
  ];
};