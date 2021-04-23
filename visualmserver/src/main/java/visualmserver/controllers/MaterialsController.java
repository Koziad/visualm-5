package visualmserver.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import visualmserver.exceptions.AuthorizationException;
import visualmserver.exceptions.InvalidDataException;
import visualmserver.exceptions.PreConditionException;
import visualmserver.exceptions.ResourceNotFoundException;
import visualmserver.models.Material;
import visualmserver.models.MaterialIngredient;
import visualmserver.models.User;
import visualmserver.repositories.IngredientRepository;
import visualmserver.repositories.MaterialIngredientRepository;
import visualmserver.repositories.MaterialsRepository;
import visualmserver.repositories.UserRepository;
import visualmserver.util.FileUploadHandler;
import visualmserver.util.JWTokenInfo;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/materials")
public class MaterialsController {
    @Autowired
    private MaterialsRepository materialsRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private MaterialIngredientRepository materialIngredientRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Material> getAllMaterials() throws IOException {
        List<Material> materials = this.materialsRepository.findAll();

        for (Material material : materials) {
            material.setOverviewURL(FileUploadHandler.getFileBase64(material.getOverviewURL()));
            material.setCloseUpURL(FileUploadHandler.getFileBase64(material.getCloseUpURL()));
        }

        return materials;
    }

    @GetMapping("/{sequenceNumber}")
    public Material getMaterialFromSequenceNumber(@PathVariable Long sequenceNumber) throws IOException {
        Material material = this.materialsRepository.getMaterialBySequenceNumber(sequenceNumber);

        if (material == null) {
            throw new ResourceNotFoundException(String.format("Material not found with sequenceNumber=%d", sequenceNumber));
        }

        material.setOverviewURL(FileUploadHandler.getFileBase64(material.getOverviewURL()));
        material.setCloseUpURL(FileUploadHandler.getFileBase64(material.getCloseUpURL()));

        return material;
    }

    @GetMapping("published/{sequenceNumberPublished}")
    public Material getMaterialFromSequenceNumberPublished(@PathVariable Long sequenceNumberPublished) throws IOException {
        Material material = this.materialsRepository.getMaterialBySequenceNumberPublished(sequenceNumberPublished);

        if (material == null) {
            throw new ResourceNotFoundException(String.format("Material not found with sequenceNumberPublished=%d", sequenceNumberPublished));
        }

        material.setOverviewURL(FileUploadHandler.getFileBase64(material.getOverviewURL()));
        material.setCloseUpURL(FileUploadHandler.getFileBase64(material.getCloseUpURL()));

        return material;
    }

    @GetMapping("/user/{id}")
    public List<Material> getMaterialFromUserId(@PathVariable int id) throws IOException {
        User user = this.userRepository.getUserById(id);
        List<Material> materials = this.materialsRepository.getMaterialsByUser(user);

        for (Material material : materials) {
            material.setOverviewURL(FileUploadHandler.getFileBase64(material.getOverviewURL()));
            material.setCloseUpURL(FileUploadHandler.getFileBase64(material.getCloseUpURL()));
        }

        return materials;
    }

    @DeleteMapping("/{sequenceNumber}")
    public ResponseEntity<Long> deleteMaterial(@PathVariable Long sequenceNumber, @RequestAttribute(value = JWTokenInfo.ATTRIBUTE_KEY) JWTokenInfo tokenInfo) {
        if (!tokenInfo.isAdmin()) {
            throw new AuthorizationException("Only administrators are able to remove existing users.");
        }

        if (this.materialsRepository.getMaterialBySequenceNumber(sequenceNumber) == null) {
            throw new ResourceNotFoundException(String.format("Material not found with sequenceNumber=%d", sequenceNumber));
        }

        Long deletedMaterialCount = this.materialsRepository.deleteMaterialBySequenceNumber(sequenceNumber);

        return ResponseEntity.ok().body(deletedMaterialCount);
    }

    @PostMapping
    public ResponseEntity<Material> saveMaterial(@RequestBody @Valid Material material, Errors errors) throws IOException {
        if (errors.hasErrors()) {
            //throw new InvalidDataException("Invalid Material object data.");
            throw new InvalidDataException(errors.toString());
        }

        this.validateSize(material);

        if (material.getOverviewURL() != null) {
            String savedImgPath = FileUploadHandler.upload(material.getOverviewURL(), String.format("/images/material/%s/", material.getUser().getId()));
            material.setOverviewURL(savedImgPath);
        }

        if (material.getCloseUpURL() != null) {
            String savedImgPath = FileUploadHandler.upload(material.getCloseUpURL(), String.format("/images/material/%s/", material.getUser().getId()));
            material.setCloseUpURL(savedImgPath);
        }

        Material savedMaterial = this.insertMaterial(material, null);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{sequenceNumber}").buildAndExpand(savedMaterial.getSequenceNumber()).toUri();

        return ResponseEntity.created(uri).body(savedMaterial);
    }

    @PutMapping("/{sequenceNumber}")
    public ResponseEntity<Material> updateMaterial(@PathVariable long sequenceNumber, @RequestBody @Valid Material material, Errors errors) throws IOException {
        if (errors.hasErrors()) {
            throw new InvalidDataException("Invalid user object data.");
        }

        this.validateSize(material);

        if (material.getSequenceNumber() != sequenceNumber) {
            throw new PreConditionException(String.format("Material-sequenceNumber=%d does not match with parameter=%d",
                    material.getSequenceNumber(), sequenceNumber));
        }

        Material foundMaterial = materialsRepository.getMaterialBySequenceNumber(sequenceNumber);

        if (foundMaterial == null) {
            throw new ResourceNotFoundException(String.format("Material not found with sequenceNumber=%d", sequenceNumber));
        }

        if (material.getOverviewURL() != null) {
            String savedImgPath = FileUploadHandler.upload(material.getOverviewURL(), String.format("/images/material/%s/", material.getUser().getId()));
            material.setOverviewURL(savedImgPath);
        } else {
            material.setOverviewURL(foundMaterial.getOverviewURL());
        }

        if (material.getCloseUpURL() != null) {
            String savedImgPath = FileUploadHandler.upload(material.getCloseUpURL(), String.format("/images/material/%s/", material.getUser().getId()));
            material.setCloseUpURL(savedImgPath);
        } else {
            material.setCloseUpURL(foundMaterial.getCloseUpURL());
        }

        Material savedMaterial = this.insertMaterial(material, foundMaterial);
        return ResponseEntity.ok().body(savedMaterial);
    }

    private Material insertMaterial(Material material, Material existingMaterial) {
        Material savedMaterial = this.materialsRepository.save(material);

        if (existingMaterial != null) {
            this.materialIngredientRepository.deleteMaterialIngredientBySequenceNumber(existingMaterial.getSequenceNumber());
        }

        for (MaterialIngredient materialIngredient : material.getMaterialIngredients()) {
            // Add ingredient if not added yet
            if (materialIngredient.getIngredient().getId() == 0)
                this.ingredientRepository.save(materialIngredient.getIngredient());

            this.materialIngredientRepository.insertMaterialIngredient(savedMaterial.getSequenceNumber(),
                    materialIngredient.getIngredient().getId(), materialIngredient.getAmount());
        }
        savedMaterial.setMaterialIngredients(material.getMaterialIngredients());

        return savedMaterial;
    }

    private void validateSize(Material material) {
        System.out.println(material.getSteps().split("\\|").length);
        if (material.getSteps().split("\\|").length > Material.MAXIMUM_STEPS) {
            throw new InvalidDataException("Material can only contain a maximum of 8 steps.");
        }

        if (material.getMaterialIngredients().size() > Material.MAXIMUM_INGREDIENTS ) {
            throw new InvalidDataException("Material can only contain a maximum of 6 ingredients.");
        }
    }
}
