import { Role } from "./role";

export class User {
    private _id: string;
    private email: string;
    private password: string;
    private firstName: string;
    private lastName: string;
    private role: Role;




    constructor($_id: string = null,
        $email: string = null,
        $password: string = null,
        $firstName: string = null,
        $lastName: string = null,
        $role: Role = null,
    ) {
        this._id = $_id;
        this.email = $email;
        this.password = $password;
        this.firstName = $firstName;
        this.lastName = $lastName;
        this.role = $role;
    }

    /**
     * Getter  $_id
     * @return {string}
     */
    public get $_id(): string {
        return this._id;
    }

    /**
     * Getter $email
     * @return {string}
     */
    public get $email(): string {
        return this.email;
    }

    /**
     * Getter $password
     * @return {string}
     */
    public get $password(): string {
        return this.password;
    }

    /**
     * Getter $firstName
     * @return {string}
     */
    public get $firstName(): string {
        return this.firstName;
    }

    /**
     * Getter $lastName
     * @return {string}
     */
    public get $lastName(): string {
        return this.lastName;
    }

    /**
     * Getter $role
     * @return {Role}
     */
    public get $role(): Role {
        return this.role;
    }


    /**
     * Setter  $_id
     * @param {string} value
     */
    public set $_id(value: string) {
        this._id = value;
    }

    /**
     * Setter $email
     * @param {string} value
     */
    public set $email(value: string) {
        this.email = value;
    }

    /**
     * Setter $password
     * @param {string} value
     */
    public set $password(value: string) {
        this.password = value;
    }

    /**
     * Setter $firstName
     * @param {string} value
     */
    public set $firstName(value: string) {
        this.firstName = value;
    }

    /**
     * Setter $lastName
     * @param {string} value
     */
    public set $lastName(value: string) {
        this.lastName = value;
    }

    /**
     * Setter $role
     * @param {Role} value
     */
    public set $role(value: Role) {
        this.role = value;
    }


}