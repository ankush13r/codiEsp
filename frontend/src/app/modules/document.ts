import {ClinicalCase} from "./../interfaces/clinical-case";

export class Document{
    id:string
    file_name: string;
    data_type: string;
    clinical_case: ClinicalCase[];
    link_name:string;
    link?: String;
    yes_no?:string;
    meta_data?: {
        location: string;
        conationTime: number;
    };
}