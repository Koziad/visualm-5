import {User} from './user';
import {Material} from './material';

export class Report {
  private id: number;
  private reportMessage: string;
  private user: User;
  private material: Material;
  private solved: boolean;


  constructor(id?: number, reportMessage?: string, solved?: boolean, user?: User, material?: Material) {
    this.id = id;
    this.reportMessage = reportMessage;
    this.solved = solved;
    this.user = user;
    this.material = material;
  }

  getId() {
    return this.id;
  }

  getReportMessage() {
    return this.reportMessage;
  }

  getSolved() {
    return this.solved;
  }

  getUser() : User {
    return this.user;
  }

  getMaterial() : Material {
    return this.material;
  }

  static trueCopy (report):Report {
    return Object.assign(new Report(), report);
  }
}
