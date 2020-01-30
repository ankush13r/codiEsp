import {CaseData} from './caseData'
import {Deserializable} from './deserializable'

export class Version extends CaseData implements Deserializable {
    private id:number;
    private auxText:string;



    deserialize(input: any): this {
        Object.assign(this, input);
    
        return this;
      }



    /**
     * Getter $id
     * @return {number}
     */
	public get $id(): number {
		return this.id;
	}

    /**
     * Getter $auxText
     * @return {string}
     */
	public get $auxText(): string {
		return this.auxText;
	}

    /**
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}

    /**
     * Setter $auxText
     * @param {string} value
     */
	public set $auxText(value: string) {
		this.auxText = value;
	}
 

} 