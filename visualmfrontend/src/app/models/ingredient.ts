export class Ingredient {
  private id: number;
  private name: string;
  private type: string;

  constructor(id?: number, name?: string, type?: string) {
    this.name = name;
    this.type = type;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  static trueCopy (ingredient):Ingredient {
    return Object.assign(new Ingredient(), ingredient);
  }
}
