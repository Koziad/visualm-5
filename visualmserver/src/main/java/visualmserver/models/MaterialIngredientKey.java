package visualmserver.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * This class is used to act as a Primary Key for the MaterialIngredient Entity.
 * Since every JPA entity requires a PK and the MaterialIngredient Entity has a Composite Key
 * This class will hold those parts of the Keys
 */
@Embeddable
public class MaterialIngredientKey implements Serializable {

    @Column(name = "sequence_number")
    private Long materialId;

    @Column(name = "id")
    private Integer ingredientId;


    public MaterialIngredientKey() {

    }

    public Long getMaterialId() {
        return this.materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaterialIngredientKey that = (MaterialIngredientKey) o;
        return Objects.equals(materialId, that.materialId) &&
                Objects.equals(ingredientId, that.ingredientId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(materialId, ingredientId);
    }
}
