import {CaseData} from './caseData'
import {Deserializable} from '../../interfaces/deserializable'

export class Version extends CaseData implements Deserializable {
    private id:number;
    private user_id: string;
    private location: string;
    private time: number;

 

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
     * Getter $user_id
     * @return {string}
     */
	public get $user_id(): string {
		return this.user_id;
	}

    /**
     * Getter $location
     * @return {string}
     */
	public get $location(): string {
		return this.location;
	}

    /**
     * Getter $time
     * @return {number}
     */
	public get $time(): number {
		return this.time;
	}

    /**
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}

    /**
     * Setter $user_id
     * @param {string} value
     */
	public set $user_id(value: string) {
		this.user_id = value;
	}

    /**
     * Setter $location
     * @param {string} value
     */
	public set $location(value: string) {
		this.location = value;
	}

    /**
     * Setter $time
     * @param {number} value
     */
	public set $time(value: number) {
		this.time = value;
	}



} 