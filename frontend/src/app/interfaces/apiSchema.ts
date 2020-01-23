import {Document} from './document'

export interface ApiSchema {
    currentPage: number,
    totalRecords: number,
    perPage: number,
    error: {},
    documents: Document[]

}


