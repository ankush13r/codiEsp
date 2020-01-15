import {FileObj} from './file-obj'

export interface FilesObj {
    currentPage: number,
    totalRecords: number,
    perPage: number,
    error: {},
    documents: FileObj[]

}


