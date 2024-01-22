export interface MyFile {
  type: string;
  url: string;
  name: string;
  contentType: string;
  createdDate: string;
  lastModifiedDate: string;
  size: number;
}

type FileCollection = MyFile[];

interface FileState {
  isLoading: boolean;
  total: number;
  data: MyFile[] | null;
  hasDeleted: boolean;
  hasRenamed: boolean;
}

export { FileCollection, FileState };
