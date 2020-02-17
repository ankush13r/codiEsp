import {CaseData} from './caseData'
import {Deserializable} from './deserializable'

export class Version extends CaseData implements Deserializable {
    private id:number;

 

    deserialize(input: any): this {
        Object.assign(this, input);

        if(!this.$hpoCodes)
          this.$hpoCodes = [];
          
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
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}


} 