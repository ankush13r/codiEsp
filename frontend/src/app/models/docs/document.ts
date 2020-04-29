import { ClinicalCase } from './clinicalCase'
  
export class Document {
  private _id: string;
  private name: string;
  private link: string;
  private format: string;
  private state: string;
  private clinicalCases: ClinicalCase[];

  constructor() {
    var tmpCase = new ClinicalCase();
    tmpCase.$isNew = true;
    this.clinicalCases = [tmpCase]
  }

  deserialize(input: any): this {

    Object.assign(this, input);

    if (input.clinicalCases && Array.isArray(input.clinicalCases) && input.clinicalCases.length > 0) {
      input.clinicalCases.sort((a, b) => a.case_id - b.case_id)
      this.clinicalCases = input.clinicalCases.map(clinicalCase => new ClinicalCase().deserialize(clinicalCase));

    } else {
      var tmpCase = new ClinicalCase();
      tmpCase.$isNew = true;
      this.clinicalCases = [tmpCase]
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
   * Getter $clinicalCases
   * @return {ClinicalCase[]}
   */
  public get $clinicalCases(): ClinicalCase[] {
    return this.clinicalCases;
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
   * Setter $clinicalCases
   * @param {ClinicalCase[]} value
   */
  public set $clinicalCases(value: ClinicalCase[]) {
    this.clinicalCases = value;
  }


}
