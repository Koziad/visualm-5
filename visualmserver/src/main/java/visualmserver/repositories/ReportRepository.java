package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import visualmserver.models.Ingredient;
import visualmserver.models.Report;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    Report getReportById(int id);

    @Transactional
    @Modifying
    Integer deleteById(int id);

}
