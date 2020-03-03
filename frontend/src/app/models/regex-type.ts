export class RegexType {
    private _id: string;
    private value: string;
    private type: string;
    private order: string;
    private ignoreCase: boolean;


    constructor($_id: string = null, $type: string = null, $value: string = null, $order: string = null, $ignoreCase: boolean = null) {
        this._id = $_id;
        this.value = $value;
        this.order = $order;
        this.type = $type;
        this.ignoreCase = $ignoreCase;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
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
     * Getter $type
     * @return {string}
     */
    public get $type(): string {
        return this.type;
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
    public set id(value: string) {
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
     * Setter $type
     * @param {string} value
     */
    public set $type(value: string) {
        this.type = value;
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
