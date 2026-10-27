
package com.nexushr.employeeservice.performance;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PerformanceService {

    private final PerformanceRepository performanceRepository;

    public PerformanceService(PerformanceRepository performanceRepository) {
        this.performanceRepository = performanceRepository;
    }

    @Transactional
    public Performance createReview(Performance performance) {

        if (performance.getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        if (performance.getRating() == null
                || performance.getRating() < 1
                || performance.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        if (performance.getReviewPeriod() == null
                || performance.getReviewPeriod().isBlank()) {
            throw new IllegalArgumentException("Review period is required");
        }

        if (performance.getReviewDate() == null) {
            performance.setReviewDate(LocalDate.now());
        }

        return performanceRepository.save(performance);
    }

    public List<Performance> getAllReviews() {
        return performanceRepository.findAll();
    }

    public List<Performance> getReviewsByEmployee(Long employeeId) {
        return performanceRepository.findByEmployeeId(employeeId);
    }

    public Performance getReviewById(Long id) {
        return performanceRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Performance review not found"));
    }

    @Transactional
    public Performance updateReview(Long id, Performance updatedPerformance) {

        Performance existing = getReviewById(id);

        if (updatedPerformance.getRating() == null
                || updatedPerformance.getRating() < 1
                || updatedPerformance.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        if (updatedPerformance.getReviewPeriod() == null
                || updatedPerformance.getReviewPeriod().isBlank()) {
            throw new IllegalArgumentException("Review period is required");
        }

        existing.setReviewPeriod(updatedPerformance.getReviewPeriod());
        existing.setRating(updatedPerformance.getRating());
        existing.setGoals(updatedPerformance.getGoals());
        existing.setFeedback(updatedPerformance.getFeedback());

        if (updatedPerformance.getReviewDate() != null) {
            existing.setReviewDate(updatedPerformance.getReviewDate());
        }

        return performanceRepository.save(existing);
    }

    @Transactional
    public void deleteReview(Long id) {
        Performance review = getReviewById(id);
        performanceRepository.delete(review);
    }
}
