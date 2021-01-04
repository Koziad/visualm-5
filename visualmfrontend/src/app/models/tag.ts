export class Tag {
  private id: number;
  private name: string;

  constructor(id?: number, name?: string) {
    this.id = id;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getId(): number {
    return this.id;
  }

  static trueCopy(tag: any): Tag {
    return Object.assign(new Tag(), tag);
  }
}

