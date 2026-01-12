import { UploadRequestPayload, UploadResponsePayload } from '../types';

export const processUpload = async (payload: UploadRequestPayload): Promise<UploadResponsePayload> => {
  console.log('Sending Payload to Backend:', JSON.stringify(payload, null, 2));

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response based on the prompt's requirement
  // We use the input cas_id to make it feel dynamic
  return {
    status: "success",
    cas_id: payload.cas_id,
    report_path: `${payload.cas_id}_report.csv`,
    download_url: `/agent/download-report?path=${payload.cas_id}_report.csv`
  };
};
