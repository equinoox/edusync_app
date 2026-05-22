export type DocumentListItem = {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageKey: string | null;
  pageCount: number;
  createdAt: string | Date;
};

export type DocumentUploadResult = {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageKey: string | null;
  pageCount: number;
  createdAt: string | Date;
};
