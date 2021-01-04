package visualmserver.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import visualmserver.exceptions.AuthorizationException;
import visualmserver.exceptions.InvalidDataException;
import visualmserver.exceptions.ResourceNotFoundException;
import visualmserver.models.Ingredient;
import visualmserver.repositories.IngredientRepository;
import visualmserver.util.JWTokenInfo;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/ingredients")
public class IngredientsController {
    @Autowired
    private IngredientRepository ingredientsRepository;

    @PostMapping
    public ResponseEntity<Ingredient> saveIngredient(@RequestBody @Valid Ingredient ingredient, Errors errors) {
        if (errors.hasErrors()) {
            throw new InvalidDataException("Incorrect value types.");
        }

        Ingredient savedIngredient = this.ingredientsRepository.save(ingredient);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedIngredient.getId()).toUri();

        return ResponseEntity.created(uri).body(savedIngredient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteIngredient(@PathVariable int id, @RequestAttribute(value = JWTokenInfo.ATTRIBUTE_KEY) JWTokenInfo tokenInfo) {
        if(!tokenInfo.isAdmin()) {
            throw new AuthorizationException("Only administrators are able to remove existing users.");
        }

        if (this.ingredientsRepository.getIngredientById(id) == null) {
            throw new ResourceNotFoundException(String.format("Ingredient not found with id=%d", id));
        }

        return ResponseEntity.ok().body(this.ingredientsRepository.deleteById(id));
    }

    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return this.ingredientsRepository.findAll();
    }

    @GetMapping("/{id}")
    public Ingredient getById(@PathVariable int id) {
        Ingredient foundIngredient = this.ingredientsRepository.getIngredientById(id);

        if (foundIngredient == null) {
            throw new ResourceNotFoundException(String.format("Ingredient not found with id=%d", id));
        }

        return foundIngredient;
    }

    @GetMapping("/search")
    public List<Ingredient> getAllByName(@RequestParam String name) {
        return this.ingredientsRepository.findAllByNameIsContaining(name);
    }

}
