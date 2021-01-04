export class User {
  private id: number;
  private firstname: string;
  private lastname: string;
  private organisation: string;
  private email: string;
  private password: string;
  private img_path: string;
  private admin: boolean;
  private verified: boolean;

  constructor(email?: string, password?: string, id?: number, firstname?: string, lastname?: string, organisation?: string, isAdmin?: boolean, verified?: boolean) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.organisation = organisation;
    this.email = email;
    this.password = password;
    this.admin = isAdmin;
    this.verified = verified;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  setAdmin(admin: boolean): void {
    this.admin = admin;
  }

  getFirstname(): string {
    return this.firstname;
  }

  getLastname(): string {
    return this.lastname;
  }

  getId(): number {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getOrganisation(): string {
    return this.organisation;
  }

  setId(id: number): void {
    this.id = id;
  }

  public getMediaURL(): string {
    return this.img_path;
  }

  getPassword(): string {
    return this.password;
  }

  public setMediaURL(img_path: string): void {
    this.img_path = img_path;
  }

  public isVerified(): boolean {
    return this.verified;
  }



  static trueCopy(user): User {
    return Object.assign(new User(), user);
  }
}
