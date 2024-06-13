import axios, { AxiosRequestConfig } from "axios";

import { CreateFileData, FileCheck, FileCreate } from "graphql/types";
import { getApolloClient } from "graphql/ApolloClient";
import { CREATE_FILE, CHECK_UPLOADING_FILE } from "graphql/mutation";
import { t } from "@lingui/macro";
import { cloneDeep } from "lodash";

export type FileResponse = FileCreate & { downloadUrl?: string };

export type UploadingInformation = {
  uploadingFile: File;
  isPublic?: boolean;
};

export const uploadFile = async (
  uploadingInfo: UploadingInformation,
  config?: AxiosRequestConfig,
): Promise<FileResponse | string> => {
  const uploadingFile = uploadingInfo.uploadingFile;

  // Step 1: Create File
  const inputData: CreateFileData = {
    fileName: uploadingFile.name,
    contentType: uploadingFile.type,
    contentLength: uploadingFile.size,
    public: uploadingInfo.isPublic || false,
  };
  const apolloClient = getApolloClient();
  const { data, errors: createFileError } =
    await apolloClient.mutate<FileCreate>({
      mutation: CREATE_FILE,
      variables: { data: inputData },
    });
  if (createFileError || !data)
    return t`Cannot create file: ${createFileError}`;
  const { file, uploadInfo } = data.fileCreate;

  // Step 2: Upload to S3 by Uploading Info in Step 1
  const s3Result = await uploadS3(
    uploadInfo.uploadUrl,
    uploadInfo.fields,
    uploadingFile,
    config,
  );
  if (!s3Result) return t`Cannot upload file to storage`;

  // Step 3: Completed Upload, Check file in backend side
  const { errors, data: checkData } = await apolloClient.mutate<FileCheck>({
    mutation: CHECK_UPLOADING_FILE,
    variables: { fileId: file.uuid },
  });
  if (errors && errors.length > 0)
    return t`Cannot re-check file in system: ${errors[0].message}`;

  return {
    ...cloneDeep(data),
    downloadUrl: checkData?.fileCheck,
  };
};

export const uploadS3 = async (
  uploadUrl: string,
  fields: Record<string, string>,
  file: File,
  config?: AxiosRequestConfig,
): Promise<boolean> => {
  const formData = new FormData();
  Object.entries(fields).map(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const res = await axios.post(uploadUrl, formData, config);
  return res.status === 204;
};

export interface FileItem {
  fileId: string;
  fileName?: string;
  contentType: string;
  publicUrl?: string;
}

export const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";
