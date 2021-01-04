package visualmserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "tag")
public class Tag {
    @NotNull
    @Id
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MaterialTag name;

    @JsonIgnore
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private List<Material> materials;

    public void setId(long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public MaterialTag getName() {
        return name;
    }

    public void setName(MaterialTag name) {
        this.name = name;
    }

    public List<Material> getMaterials() {
        return materials;
    }

    public void addMaterial(Material material) {
        this.materials.add(material);
        material.addTag(this);
    }
}
