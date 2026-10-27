
package com.nexushr.employeeservice.recruitment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobOpeningRepository jobOpeningRepository;

    public CandidateService(
            CandidateRepository candidateRepository,
            JobOpeningRepository jobOpeningRepository) {
        this.candidateRepository = candidateRepository;
        this.jobOpeningRepository = jobOpeningRepository;
    }

    @Transactional
    public Candidate createCandidate(Candidate candidate) {
        candidate.setId(null);

        if (candidate.getJobOpeningId() == null) {
            throw new IllegalArgumentException("Job opening ID is required");
        }

        JobOpening job = jobOpeningRepository
                .findById(candidate.getJobOpeningId())
                .orElseThrow(() ->
                        new RuntimeException("Job opening not found"));

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new IllegalArgumentException(
                    "Applications are closed for this job");
        }

        if (candidate.getEmail() == null
                || candidate.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (candidateRepository
                .findByEmailIgnoreCase(candidate.getEmail().trim())
                .isPresent()) {
            throw new IllegalArgumentException(
                    "A candidate with this email already exists");
        }

        candidate.setFullName(candidate.getFullName().trim());
        candidate.setEmail(candidate.getEmail().trim());
        candidate.setStatus("APPLIED");

        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidate not found with ID: " + id));
    }

            @Transactional
        public Candidate updateCandidate(Long id, Candidate updatedCandidate) {
            Candidate existingCandidate = getCandidateById(id);

            if (updatedCandidate.getFullName() == null
                    || updatedCandidate.getFullName().isBlank()) {
                throw new IllegalArgumentException("Candidate name is required");
            }

            if (updatedCandidate.getEmail() == null
                    || updatedCandidate.getEmail().isBlank()) {
                throw new IllegalArgumentException("Candidate email is required");
            }

            String email = updatedCandidate.getEmail().trim();

            boolean emailUsed = candidateRepository.findByEmailIgnoreCase(email)
                    .filter(candidate -> !candidate.getId().equals(id))
                    .isPresent();

            if (emailUsed) {
                throw new IllegalArgumentException(
                        "Another candidate already uses this email");
            }

            existingCandidate.setFullName(updatedCandidate.getFullName().trim());
            existingCandidate.setEmail(email);
            existingCandidate.setPhone(updatedCandidate.getPhone());
            existingCandidate.setSkills(updatedCandidate.getSkills());

            return candidateRepository.save(existingCandidate);
        }

    public List<Candidate> getCandidatesByJob(Long jobOpeningId) {
        return candidateRepository.findByJobOpeningId(jobOpeningId);
    }

    public List<Candidate> getCandidatesByStatus(String status) {
        return candidateRepository.findByStatus(status);
    }

    public Candidate updateCandidateStatus(Long id, String status) {
        Candidate candidate = getCandidateById(id);

        if (status == null || !List.of(
                "APPLIED",
                "SCREENING",
                "INTERVIEW",
                "SELECTED",
                "REJECTED"
        ).contains(status.trim().toUpperCase())) {
            throw new IllegalArgumentException(
                    "Invalid application status");
        }

        candidate.setStatus(status.trim().toUpperCase());

        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Long id) {
        Candidate candidate = getCandidateById(id);
        candidateRepository.delete(candidate);
    }
}
