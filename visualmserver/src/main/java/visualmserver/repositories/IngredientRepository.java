package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import visualmserver.models.Ingredient;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, String> {

    Ingredient getIngredientById(int id);
    List<Ingredient> getIngredientByName(String name);
    List<Ingredient> findAllByNameIsContaining(String name);

    @Transactional
    @Modifying
    Integer deleteById(int id);
}
