
package com.nexushr.employeeservice.recruitment;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment/jobs")
public class JobOpeningController {

    private final JobOpeningService jobOpeningService;

    public JobOpeningController(JobOpeningService jobOpeningService) {
        this.jobOpeningService = jobOpeningService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobOpening createJob(@RequestBody JobOpening job) {
        return jobOpeningService.createJob(job);
    }

    @GetMapping
    public List<JobOpening> getAllJobs() {
        return jobOpeningService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobOpening getJobById(@PathVariable Long id) {
        return jobOpeningService.getJobById(id);
    }

    @GetMapping("/open")
    public List<JobOpening> getOpenJobs() {
        return jobOpeningService.getOpenJobs();
    }

    @PutMapping("/{id}")
    public JobOpening updateJob(
            @PathVariable Long id,
            @RequestBody JobOpening job) {
        return jobOpeningService.updateJob(id, job);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id) {
        jobOpeningService.deleteJob(id);
    }
}
