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
import visualmserver.models.Ingredient;
import visualmserver.models.Report;
import visualmserver.repositories.IngredientRepository;
import visualmserver.repositories.ReportRepository;
import visualmserver.util.JWTokenInfo;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/report")
public class ReportController {
    @Autowired
    private ReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<Report> saveReport(@RequestBody @Valid Report report, Errors errors) {
        if (errors.hasErrors()) {
            throw new InvalidDataException("Incorrect value types.");
        }

        Report savedReport = this.reportRepository.save(report);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedReport.getId()).toUri();

        return ResponseEntity.created(uri).body(savedReport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable int id, @RequestBody @Valid Report report, Errors errors) {
        if (errors.hasErrors()) {
            throw new InvalidDataException("Incorrect value types.");
        }

        if (report.getId() != id) {
            throw new PreConditionException(String.format("Report-ID=%d does not match with parameter=%d", report.getId(), id));
        }

        Report savedReport = this.reportRepository.save(report);

        return ResponseEntity.ok().body(savedReport);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteReport(@PathVariable int id, @RequestAttribute(value = JWTokenInfo.ATTRIBUTE_KEY) JWTokenInfo tokenInfo) {
        if(!tokenInfo.isAdmin()) {
            throw new AuthorizationException("Only administrators are able to remove existing reports.");
        }

        if (this.reportRepository.getReportById(id) == null) {
            throw new ResourceNotFoundException(String.format("Report not found with id=%d", id));
        }

        return ResponseEntity.ok().body(this.reportRepository.deleteById(id));
    }

    @GetMapping
    public List<Report> getAllReport() {
        return this.reportRepository.findAll();
    }

    @GetMapping("/{id}")
    public Report getById(@PathVariable int id) {
        Report foundReport = this.reportRepository.getReportById(id);

        if (foundReport == null) {
            throw new ResourceNotFoundException(String.format("Report not found with id=%d", id));
        }

        return foundReport;
    }

}
