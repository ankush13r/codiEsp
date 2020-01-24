import {ClinicalCase} from "./clinical-case"

export interface Document {
    file_name: String;
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

export interface TmpDocument {
    id:string;
    file_name: String;
    data_type: String;
    link_name:String;
    clinical_case?: ClinicalCase[]
}