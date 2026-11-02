package com.nexushr.employeeservice.performance;

import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final CurrentUserService currentUserService;

    public PerformanceController(
            PerformanceService performanceService,
            CurrentUserService currentUserService) {
        this.performanceService = performanceService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Performance createReview(@RequestBody Performance performance) {
        currentUserService.assertAdmin();
        return performanceService.createReview(performance);
    }

    @GetMapping
    public List<Performance> getAllReviews() {
        if (currentUserService.isAdmin()) {
            return performanceService.getAllReviews();
        }
        return performanceService.getReviewsByEmployee(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/me")
    public List<Performance> ownReviews() {
        return performanceService.getReviewsByEmployee(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/employee/{employeeId}")
    public List<Performance> getReviewsByEmployee(@PathVariable Long employeeId) {
        currentUserService.assertCanAccessEmployee(employeeId);
        return performanceService.getReviewsByEmployee(employeeId);
    }

    @GetMapping("/{id}")
    public Performance getReviewById(@PathVariable Long id) {
        Performance review = performanceService.getReviewById(id);
        currentUserService.assertCanAccessEmployee(review.getEmployeeId());
        return review;
    }

    @PutMapping("/{id}")
    public Performance updateReview(
            @PathVariable Long id,
            @RequestBody Performance performance) {
        currentUserService.assertAdmin();
        return performanceService.updateReview(id, performance);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        currentUserService.assertAdmin();
        performanceService.deleteReview(id);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }
}
