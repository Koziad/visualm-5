package visualmserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Entity
@Table(name = "user")
public class User {

  @NotNull
  @Id
  @GeneratedValue (strategy = GenerationType.AUTO)
  private int id;
  @NotNull
  @NotBlank
  private String firstname;

  @NotNull
  @NotBlank
  private String lastname;

  private String organisation;

  @NotNull
  @NotBlank
  private String email;

  @NotNull
  @NotBlank
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @OneToMany(mappedBy = "user", cascade = {CascadeType.REMOVE})
  @JsonIgnore
  private Set<Material> materials;

  private String img_path;

  @Column(name = "is_admin")
  private boolean admin;

  private boolean verified;
  
  public User() {
  }

  public User(String firstname, String lastname, String organisation, String email, String password, String img_path) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.organisation = organisation;
    this.email = email;
    this.password = password;
    this.img_path = img_path;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getFirstname() {
    return firstname;
  }

  public void setFirstname(String firstname) {
    this.firstname = firstname;
  }

  public String getLastname() {
    return lastname;
  }

  public void setLastname(String lastname) {
    this.lastname = lastname;
  }

  public String getOrganisation() {
    return organisation;
  }

  public void setOrganisation(String organisation) {
    this.organisation = organisation;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Material> getMaterials() {
    return materials;
  }

  public void setMaterials(Set<Material> materials) {
    this.materials = materials;
  }

  public String getimg_path() {
    return img_path;
  }

  public void setMediaURL(String mediaURL) {
    this.img_path = mediaURL;
  }

  public boolean isAdmin() {
    return admin;
  }

  public boolean isVerified() {
    return verified;
  }

  public void setVerified(boolean verified) {
    this.verified = verified;
  }
}
