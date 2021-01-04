import { Ingredient } from './ingredient';

export class MaterialIngredient {
  private ingredient: Ingredient;
  private amount: number;

  constructor(ingredient?: Ingredient, amount?: number) {
    this.ingredient = ingredient;
    this.amount = amount;
  }

  public getIngredient(): Ingredient {
    return this.ingredient;
  }

  public getAmount(): number {
    return this.amount;
  }

  static trueCopy (materialIngredient):MaterialIngredient {
    return Object.assign(new MaterialIngredient(), materialIngredient);
  }

  public setIngredient(ingredient:Ingredient): void {
    this.ingredient = ingredient;
  }
}
