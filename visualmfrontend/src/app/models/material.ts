import {MaterialIngredient} from './material-ingredient';
import {MaterialType} from './material-type.enum';
import {SaveStatus} from './save-status.enum';
import {Tag} from './tag';
import {User} from './user';

export class Material {
  public static readonly MAXIMUM_STEPS = 10;
  public static readonly MAXIMUM_INGREDIENTS = 6;
  private static FORMAT = '00000';
  private sequenceNumber: number;
  sequenceNumberPublished: number;
  private name: string;
  private creationDate: Date;
  private changes: string;
  private reference: string;
  private steps: string;
  private overviewURL: string;
  private closeUpURL: string;
  private qrCodeURL: string;
  private tags: Tag[];
  private materialIngredients: MaterialIngredient[];
  private saveStatus: SaveStatus;
  private type: MaterialType;
  private user: User;
  private parentId: number;

  constructor(sequenceNumber?: number, name?: string, changes?: string, steps?: string, qrCodeURL?: string,
              tags?: Tag[], materialIngredients?: MaterialIngredient[], saveStatus?: SaveStatus, type?: MaterialType, user?: User,
              parentId?: number, reference?: string) {
    this.sequenceNumber = sequenceNumber;
    this.name = name;
    this.changes = changes;
    this.creationDate = new Date();
    this.steps = steps;
    this.qrCodeURL = qrCodeURL;
    this.tags = tags;
    this.materialIngredients = materialIngredients;
    this.saveStatus = saveStatus;
    this.type = type;
    this.user = user;
    this.parentId = parentId;
    this.reference = reference;
  }

  public getSequenceNumber(): number {
    return this.sequenceNumber;
  }

  public getFormattedSequenceNumber(): string {
    if (this.sequenceNumberPublished == null) {
      return "OLD" + this.sequenceNumber;
    } else {
      return Material.FORMAT.substring(0, Material.FORMAT.length - this.getSequenceNumberPublished().toString().length) + this.getSequenceNumberPublished().toString();
    }
  }

  public getSequenceNumberPublished(): number {
    return this.sequenceNumberPublished;
  }

  public getName(): string {
    return this.name;
  }

  public getSteps(): string {
    return this.steps;
  }

  public setSteps(step): string {
    return this.steps;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getTags(): Tag[] {
    return this.tags;
  }

  public setTags(tags: Tag[]): void {
    this.tags = tags;
  }

  public getSaveStatus(): SaveStatus {
    return this.saveStatus;
  }

  public getOverviewURL(): string {
    return this.overviewURL;
  }

  public setOverviewURL(overviewURL: string): void {
    this.overviewURL = overviewURL;
  }

  public getUser(): User {
    return this.user;
  }

  public getQRCodeURL(): string {
    return this.qrCodeURL;
  }

  static trueCopy(material): Material {
    return Object.assign(new Material(), material);
  }

  public getType(): MaterialType {
    return this.type;
  }

  public getMaterialIngredients(): MaterialIngredient[] {
    return this.materialIngredients;
  }

  public setMaterialIngredients(materialIngredients: MaterialIngredient[]): void {
    this.materialIngredients = materialIngredients;
  }

  public setSequenceNumberPublished(sequenceNumberPublished: number): void {
    this.sequenceNumberPublished = sequenceNumberPublished;
  }

  public getChanges(): string {
    return this.changes;
  }

  public getReference(): string {
    return this.reference;
  }

  public getParentId(): number {
    return this.parentId;
  }


  public setParentId(parentId: number): void {
    this.parentId = parentId;
  }

  public getCloseUpURL(): string {
    return this.closeUpURL;
  }

  public setCloseUpURL(closeUpURL: string): void {
    this.closeUpURL = closeUpURL;
  }
}
