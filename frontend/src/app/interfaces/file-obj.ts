export interface FileObj {
    file_name: String,
    data_type: String,
    clinical_case: string,
    old_versions:[],
    link_name:String,
    time?:any,
    doc_id?:String,
    link?: String,
    yes_no?:string,
    meta_data?: {
        location: string,
        conationTime: number
    },
    error?: {
        message: string
    };
}

