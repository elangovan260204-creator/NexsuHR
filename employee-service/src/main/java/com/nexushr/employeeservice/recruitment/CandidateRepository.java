
package com.nexushr.employeeservice.recruitment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository
        extends JpaRepository<Candidate, Long> {

    List<Candidate> findByStatus(String status);

    List<Candidate> findByJobOpeningId(Long jobOpeningId);

    Optional<Candidate> findByEmailIgnoreCase(String email);

    List<Candidate> findByFullNameContainingIgnoreCase(String fullName);
}
