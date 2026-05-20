export type DocumentListItem = {
  id: string;
  userId: string;
  resourceId: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  createdAt: string | Date;
};

export type DocumentUploadResult = {
  fileName: string;
  pageCount: number;
};
