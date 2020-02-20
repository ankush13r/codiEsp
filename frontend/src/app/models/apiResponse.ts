import { Deserializable } from './deserializable';
import { Document } from './document';


export class ApiResponse implements Deserializable {
  private currentPage: number;
  private perPage: number;
  private totalRecords: number;
  private documents: Document[];


  deserialize(input: any): this {
    Object.assign(this, input);

    this.documents = input.documents.map(document => new Document().deserialize(document));

    return this;
  }


  /**
   * Getter $currentPage
   * @return {number}
   */
  public get $currentPage(): number {
    return this.currentPage;
  }

  /**
   * Getter $perPage
   * @return {number}
   */
  public get $perPage(): number {
    return this.perPage;
  }

  /**
   * Getter $totalRecords
   * @return {number}
   */
  public get $totalRecords(): number {
    return this.totalRecords;
  }

  /**
   * Getter $documents
   * @return {Document[]}
   */
  public get $documents(): Document[] {
    return this.documents;
  }

  /**
   * Setter $currentPage
   * @param {number} value
   */
  public set $currentPage(value: number) {
    this.currentPage = value;
  }

  /**
   * Setter $perPage
   * @param {number} value
   */
  public set $perPage(value: number) {
    this.perPage = value;
  }

  /**
   * Setter $totalRecords
   * @param {number} value
   */
  public set $totalRecords(value: number) {
    this.totalRecords = value;
  }

  /**
   * Setter $documents
   * @param {Document[]} value
   */
  public set $documents(value: Document[]) {
    this.documents = value;
  }

}