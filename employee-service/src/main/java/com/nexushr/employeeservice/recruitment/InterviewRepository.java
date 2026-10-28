
package com.nexushr.employeeservice.recruitment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByCandidateId(Long candidateId);

    List<Interview> findByStatusIgnoreCase(String status);
}
