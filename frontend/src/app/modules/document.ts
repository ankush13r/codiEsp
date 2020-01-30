import { ClinicalCase } from './clinicalCase'
import { Version } from './version';

export class Document {
  private _id: string;
  private name: string;
  private link: string;
  private format: string;
  private state: string;
  private clinical_cases: ClinicalCase[];


	
  deserialize(input: any): this {

    Object.assign(this, input);
    if(input.clinical_cases && Array.isArray(input.clinical_cases) && input.clinical_cases.length > 0){
      this.clinical_cases = input.clinical_cases.map(clinical_case => new ClinicalCase().deserialize(clinical_case));
    }else{
      this.clinical_cases = [new ClinicalCase()]
    }

    return this;
  }


	/**
	 * Getter id
	 *
	 * @author	Unknown
	 * @since	v0.0.1
	 * @version	v1.0.0	Thursday, January 30th, 2020.	
	 * @version	v1.0.1	Thursday, January 30th, 2020.
	 * @access	public
	 * @return	mixed
	 */
	public get $_id(): string {
		return this._id;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $link
     * @return {string}
     */
	public get $link(): string {
		return this.link;
	}

    /**
     * Getter $format
     * @return {string}
     */
	public get $format(): string {
		return this.format;
	}

    /**
     * Getter $state
     * @return {string}
     */
	public get $state(): string {
		return this.state;
	}

    /**
     * Getter $clinical_cases
     * @return {ClinicalCase[]}
     */
	public get $clinical_cases(): ClinicalCase[] {
		return this.clinical_cases;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set $_id(value: string) {
		this._id = value;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $link
     * @param {string} value
     */
	public set $link(value: string) {
		this.link = value;
	}

    /**
     * Setter $format
     * @param {string} value
     */
	public set $format(value: string) {
		this.format = value;
	}

    /**
     * Setter $state
     * @param {string} value
     */
	public set $state(value: string) {
		this.state = value;
	}

    /**
     * Setter $clinical_cases
     * @param {ClinicalCase[]} value
     */
	public set $clinical_cases(value: ClinicalCase[]) {
		this.clinical_cases = value;
	}


}
