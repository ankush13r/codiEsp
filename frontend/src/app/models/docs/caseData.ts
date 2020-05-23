export class CaseData {
    private clinicalCase: string;
    private yes_no: string;
    private hpoCodes: Object[];


    constructor() {
        this.$hpoCodes = [];
    }

    /**
     * Getter $clinicalCase
     * @return {string}
     */
    public get $clinicalCase(): string {
        return this.clinicalCase;
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
     * Setter $clinicalCase
     * @param {string} value
     */
    public set $clinicalCase(value: string) {
        this.clinicalCase = value;
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

 

}