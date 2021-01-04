package visualmserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jdk.jfr.Unsigned;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "material_has_ingredient")
public class MaterialIngredient {
    @EmbeddedId
    private MaterialIngredientKey key;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "id")
    private Ingredient ingredient;

    @ManyToOne
    @MapsId("materialId")
    @JoinColumn(name = "sequence_number")
    @JsonIgnore
    private Material material;

    @NotNull
    @Unsigned
    private int amount;

    public MaterialIngredient() {

    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public MaterialIngredientKey getKey() {
        return key;
    }

    public void setKey(MaterialIngredientKey key) {
        this.key = key;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaterialIngredient that = (MaterialIngredient) o;
        return amount == that.amount &&
                Objects.equals(key, that.key) &&
                Objects.equals(ingredient, that.ingredient) &&
                Objects.equals(material, that.material);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key, ingredient, material, amount);
    }
}
