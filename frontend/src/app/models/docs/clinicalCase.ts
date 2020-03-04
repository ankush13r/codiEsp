import { CaseData } from './caseData'
import { Version } from './version';
import { Deserializable } from '../../interfaces/deserializable';

export class ClinicalCase extends CaseData implements Deserializable {
    private _id: string;
    private case_id: number;
    private source_id: string;
    private versions: Version[];
    private isNew: boolean;
    private newCaseVersion: Version;


    constructor() {
        super();
        this.newCaseVersion = new Version();
        this.versions = []
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        
        if (input.versions) {
            input.versions.sort((a,b)=> a.id - b.id)
            this.versions = input.versions.map(version => new Version().deserialize(version));
        }else{
            this.versions = []
        }
                
        return this;
    }


    /**
     * Getter id
     * @return {string}
     */
    public get $_id(): string {
        return this._id;
    }

    /**
     * Getter $case_id
     * @return {number}
     */
    public get $case_id(): number {
        return this.case_id;
    }

    /**
     * Getter $source_id
     * @return {string}
     */
    public get $source_id(): string {
        return this.source_id;
    }

    /**
     * Getter $versions
     * @return {Version[]}
     */
    public get $versions(): Version[] {
        return this.versions;
    }

    /**
     * Getter $isNew
     * @return {boolean}
     */
    public get $isNew(): boolean {
        return this.isNew;
    }

    /**
     * Getter $newCaseVersion
     * @return {Version}
     */
    public get $newCaseVersion(): Version {
        return this.newCaseVersion;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set $_id(value: string) {
        this._id = value;
    }

    /**
     * Setter $case_id
     * @param {number} value
     */
    public set $case_id(value: number) {
        this.case_id = value;
    }

    /**
     * Setter $source_id
     * @param {string} value
     */
    public set $source_id(value: string) {
        this.source_id = value;
    }

    /**
     * Setter $versions
     * @param {Version[]} value
     */
    public set $versions(value: Version[]) {
        this.versions = value;
    }

    /**
     * Setter $isNew
     * @param {boolean} value
     */
    public set $isNew(value: boolean) {
        this.isNew = value;
    }

    /**
     * Setter $newCaseVersion
     * @param {Version} value
     */
    public set $newCaseVersion(value: Version) {
        this.newCaseVersion = value;
    }

}