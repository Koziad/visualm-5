import {User} from './user';

export class Token {
  private id: number;
  private tokenValue: string;
  private expiryDate: Date;
  private user: User;

  constructor(id?: number, token?: string, expiryDate?: Date, user?: User) {
    this.id = id;
    this.tokenValue = token;
    this.expiryDate = expiryDate;
    this.user = user;
  }

  public static trueCopy(tokenObj: any): Token {
    const token: Token = Object.assign(new Token(), tokenObj);
    token.setUser(User.trueCopy(tokenObj.user));
    return token;
  }

  public getTokenValue(): string {
    return this.tokenValue;
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }
}
