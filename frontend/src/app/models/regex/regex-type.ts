export class RegexType {
    private _id: string;
    private name: string;


	constructor($_id: string=null, $name: string=null) {
		this._id = $_id;
		this.name = $name;
	}

    /**
     * Getter id
     * @return {string}
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

}
