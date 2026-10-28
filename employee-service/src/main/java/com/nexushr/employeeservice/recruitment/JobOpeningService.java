
package com.nexushr.employeeservice.recruitment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;

    public JobOpeningService(JobOpeningRepository jobOpeningRepository) {
        this.jobOpeningRepository = jobOpeningRepository;
    }

    // Create a new job opening
    public JobOpening createJob(JobOpening job) {
        validateJob(job);

        job.setId(null);

        if (job.getStatus() == null || job.getStatus().isBlank()) {
            job.setStatus("OPEN");
        }

        return jobOpeningRepository.save(job);
    }

    // Get all job openings
    public List<JobOpening> getAllJobs() {
        return jobOpeningRepository.findAll();
    }

    // Get a job opening by ID
    public JobOpening getJobById(Long id) {
        return jobOpeningRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job opening not found with ID: " + id));
    }

    // Get only open job openings
    public List<JobOpening> getOpenJobs() {
        return jobOpeningRepository.findByStatus("OPEN");
    }

    // Update an existing job opening
    @Transactional
    public JobOpening updateJob(Long id, JobOpening updatedJob) {
        JobOpening existingJob = getJobById(id);

        validateJob(updatedJob);

        existingJob.setTitle(updatedJob.getTitle().trim());
        existingJob.setDepartment(updatedJob.getDepartment().trim());
        existingJob.setLocation(updatedJob.getLocation().trim());
        existingJob.setEmploymentType(updatedJob.getEmploymentType());
        existingJob.setClosingDate(updatedJob.getClosingDate());
        existingJob.setDescription(updatedJob.getDescription());

        if (updatedJob.getStatus() != null
                && !updatedJob.getStatus().isBlank()) {
            existingJob.setStatus(updatedJob.getStatus().trim().toUpperCase());
        }

        return jobOpeningRepository.save(existingJob);
    }

    // Delete a job opening
    @Transactional
    public void deleteJob(Long id) {
        JobOpening existingJob = getJobById(id);

        jobOpeningRepository.delete(existingJob);
    }

    // Validate required job details
    private void validateJob(JobOpening job) {
        if (job == null) {
            throw new IllegalArgumentException(
                    "Job details are required");
        }

        if (job.getTitle() == null || job.getTitle().isBlank()) {
            throw new IllegalArgumentException(
                    "Job title is required");
        }

        if (job.getDepartment() == null
                || job.getDepartment().isBlank()) {
            throw new IllegalArgumentException(
                    "Department is required");
        }

        if (job.getLocation() == null
                || job.getLocation().isBlank()) {
            throw new IllegalArgumentException(
                    "Location is required");
        }

        if (job.getEmploymentType() == null
                || job.getEmploymentType().isBlank()) {
            throw new IllegalArgumentException(
                    "Employment type is required");
        }
    }
}

