package visualmserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "ingredient")
public class Ingredient {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @NotBlank(message = "Name cannot be empty.")
    @Size(max = 200)
    private String name;

    @Size(max = 200)
    private String type;

    @OneToMany(mappedBy = "ingredient", cascade = {CascadeType.REMOVE})
    @Size(max = 6)
    @JsonIgnore
    private Set<MaterialIngredient> materialIngredients;

    public Ingredient(String name, String type) {
        this.name = name;
        this.type = type;
    }

    public Ingredient() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public Set<MaterialIngredient> getMaterialIngredients() {
        return materialIngredients;
    }

    public void setMaterialIngredients(Set<MaterialIngredient> materialIngredients) {
        this.materialIngredients = materialIngredients;
    }
}
