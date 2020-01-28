
export interface Document {
    name: String;
    data_type: String;
    clinical_case: string;
    versions:[];
    link_name:String;
    time?:any;
    id?:String;
    link?: String;
    yes_no?:string;
    meta_data?: {
        location: string;
        conationTime: number;
    };
}

export interface Response{
    currentPage: number,
    totalRecords: number,
    perPage: number,
    error?: object,
    documents: TmpDocument[]
}

export interface TmpDocument {
    mongo_id:string;
    name: string;
    path: string;
    link: string;
    format: string;
    doc_class: string;
    language:string;
    licence:any;
    source?:any;
}


export interface ClinicalCase{
    mongo_id:string;
    id:number;
    clinical_case:string;
    time:number;
    yes_no:string;
    meta_data?:any;
    user_id:string;
    source_id:string;
    versions:Version[];

}

export interface Version{
    id:string;
    clinical_case:string;
    time:number;
    yes_no:string;
    meta_data?:any;
    user_id:string;
}