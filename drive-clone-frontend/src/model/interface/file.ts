export interface MyFile {
  id: number
  type: string
  url: string
  name: string
  contentType: string
  createdDate: string
  lastModifiedDate: string
  size: number
}

type FileCollection = MyFile[]

interface FileState {
  isLoading: boolean
  total: number
  data: MyFile[] | undefined
  hasDeleted: boolean
  hasRenamed: boolean
}

export type { FileCollection, FileState }
