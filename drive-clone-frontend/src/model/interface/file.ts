interface File {
  type: string;
  url: string;
  filename: string;
  createdate: string;
  lastmodified: string;
  filesize: number;
}

type FileCollection = File[];

interface FileState {
  isLoading: boolean;
  total: number;
  data: File[] | null;
}

export { FileCollection, FileState };
