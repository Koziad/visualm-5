package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import visualmserver.models.Material;
import visualmserver.models.MaterialIngredient;
import visualmserver.models.MaterialIngredientKey;

import javax.transaction.Transactional;

@Repository
public interface MaterialIngredientRepository extends JpaRepository<MaterialIngredient, MaterialIngredientKey> {
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM material_has_ingredient WHERE sequence_number = ?1", nativeQuery = true)
    void deleteMaterialIngredientBySequenceNumber(Long sequenceNumber);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO material_has_ingredient (sequence_number, id, amount) VALUES (?1, ?2, ?3)", nativeQuery = true)
    void insertMaterialIngredient(Long sequenceNumber, int id, int amount);
}
