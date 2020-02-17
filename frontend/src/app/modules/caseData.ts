export class CaseData {
    private clinical_case: string;
    private yes_no: string;
    private hpoCodes: Object[];
    private user_id: string;
    private location: string;
    private time: number;

    constructor() {
        this.$hpoCodes = [];
    }

    /**
     * Getter $clinical_case
     * @return {string}
     */
    public get $clinical_case(): string {
        return this.clinical_case;
    }

    /**
     * Getter $yes_no
     * @return {string}
     */
    public get $yes_no(): string {
        return this.yes_no;
    }

    /**
     * Getter $hpoCodes
     * @return {Object[]}
     */
    public get $hpoCodes(): Object[] {
        return this.hpoCodes;
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
     * Setter $clinical_case
     * @param {string} value
     */
    public set $clinical_case(value: string) {
        this.clinical_case = value;
    }

    /**
     * Setter $yes_no
     * @param {string} value
     */
    public set $yes_no(value: string) {
        this.yes_no = value;
    }

    /**
     * Setter $hpoCodes
     * @param {String[]} value
     */
    public set $hpoCodes(value: Object[]) {
        this.hpoCodes = value;
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