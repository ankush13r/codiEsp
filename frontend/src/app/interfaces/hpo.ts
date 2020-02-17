export interface Hpo {
id: string;
name:string;
definition?:string, 
synonyms?: string[], 
xrefs?: string[];
comment?:string;
isLeaf?: boolean

}
