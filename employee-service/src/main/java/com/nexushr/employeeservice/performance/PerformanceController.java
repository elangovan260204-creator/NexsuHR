
package com.nexushr.employeeservice.performance;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Performance createReview(@RequestBody Performance performance) {
        return performanceService.createReview(performance);
    }

    @GetMapping
    public List<Performance> getAllReviews() {
        return performanceService.getAllReviews();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Performance> getReviewsByEmployee(
            @PathVariable Long employeeId) {
        return performanceService.getReviewsByEmployee(employeeId);
    }

    @GetMapping("/{id}")
    public Performance getReviewById(@PathVariable Long id) {
        return performanceService.getReviewById(id);
    }

    @PutMapping("/{id}")
    public Performance updateReview(
            @PathVariable Long id,
            @RequestBody Performance performance) {
        return performanceService.updateReview(id, performance);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        performanceService.deleteReview(id);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgument(IllegalArgumentException exception) {
        return exception.getMessage();
    }
}
