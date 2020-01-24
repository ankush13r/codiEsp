export interface ClinicalCase {
    id: string;
    clinical_case:string;
    case_num:number;
    version:[{
        clinical_case:String;
        time:number;
        yes_no:string;
        location:any;
    }]
}
