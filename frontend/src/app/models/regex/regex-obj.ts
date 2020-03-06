export class RegexObj {
    private _id: string;
    private value: string;
    private type_id: string;
    private order: string;
    private ignoreCase: boolean;


    constructor($_id: string = null, $type_id: string = null, $value: string = null, $order: string = null, $ignoreCase: boolean = null) {
        this._id = $_id;
        this.value = $value;
        this.order = $order;
        this.type_id = $type_id;
        this.ignoreCase = $ignoreCase;
    }

    /**
     * Getter id
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
     * Getter $type_id
     * @return {string}
     */
    public get $type_id(): string {
        return this.type_id;
    }

    /**
     * Getter $order
     * @return {string}
     */
    public get $order(): string {
        return this.order;
    }

    /**
     * Getter $ignoreCase
     * @return {boolean}
     */
    public get $ignoreCase(): boolean {
        return this.ignoreCase;
    }

    /**
     * Setter id
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
     * Setter $type_id
     * @param {string} value
     */
    public set $type_id(value: string) {
        this.type_id = value;
    }

    /**
     * Setter $order
     * @param {string} value
     */
    public set $order(value: string) {
        this.order = value;
    }

    /**
     * Setter $ignoreCase
     * @param {boolean} value
     */
    public set $ignoreCase(value: boolean) {
        this.ignoreCase = value;
    }


}
