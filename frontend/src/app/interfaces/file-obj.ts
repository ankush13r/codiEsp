export interface FileObj {
    file_name: String,
    data_type: String,
    clinical_case: string,
    time?:String,
    doc_id?:String,
    link?: String,
    meta_data?: {
        location: string,
        conationTime: number
    },
    error?: {
        message: string
    };
}

