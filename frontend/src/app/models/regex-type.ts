export class RegexType {
    private _id: string;
    private value: string;
    private type:string;
    private orderNumber: string;


	constructor($_id: string=null,$type: string=null, $value: string=null, $orderNumber: string=null) {
		this._id = $_id;
		this.value = $value;
        this.orderNumber = $orderNumber;
		this.type = $type;
	}


    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter $type
     * @return {string}
     */
	public get $type(): string {
		return this.type;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter $type
     * @param {string} value
     */
	public set $type(value: string) {
		this.type = value;
	}


    /**
     * Getter $_id
     * @return {string}
     */
	public get $_id(): string {
		return this._id;
	}

    /**
     * Getter $value
     * @return {string}
     */
	public get $value(): string {
		return this.value;
	}

    /**
     * Getter $orderNumber
     * @return {string}
     */
	public get $orderNumber(): string {
		return this.orderNumber;
	}

    /**
     * Setter $_id
     * @param {string} value
     */
	public set $_id(value: string) {
		this._id = value;
	}

    /**
     * Setter $value
     * @param {string} value
     */
	public set $value(value: string) {
		this.value = value;
	}

    /**
     * Setter $orderNumber
     * @param {string} value
     */
	public set $orderNumber(value: string) {
		this.orderNumber = value;
	}
   

}
