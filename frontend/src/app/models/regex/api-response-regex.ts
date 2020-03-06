import {Deserializable} from '../../interfaces/deserializable'

import { RegexType } from "./regex-type";
import { RegexObj } from "./regex-obj";

export class ApiResponseRegex implements Deserializable{
    private types: RegexType[];
    private regexList: RegexObj[];


    constructor($types: RegexType[]=null, $regexList: RegexObj[]=null) {
        this.types = $types;
        this.regexList = $regexList;
    }

    deserialize(input: any): this {
        
        
        this.types = input.types.map(type => Object.assign(new RegexType(),type));      
        this.regexList = input.regex.map(regexObj => Object.assign(new RegexObj(),regexObj));
        return this;
      }

    /**
     * Getter $types
     * @return {RegexType}
     */
    public get $types(): RegexType[] {
        return this.types;
    }

    /**
     * Getter $regexList
     * @return {RegexObj}
     */
    public get $regexList(): RegexObj[] {
        return this.regexList;
    }

    /**
     * Setter $types
     * @param {RegexType} value
     */
    public set $types(value: RegexType[]) {
        this.types = value;
    }

    /**
     * Setter $regexList
     * @param {RegexObj} value
     */
    public set $regexList(value: RegexObj[]) {
        this.regexList = value;
    }

}
