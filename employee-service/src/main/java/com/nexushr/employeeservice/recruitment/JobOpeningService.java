
package com.nexushr.employeeservice.recruitment;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;

    public JobOpeningService(JobOpeningRepository jobOpeningRepository) {
        this.jobOpeningRepository = jobOpeningRepository;
    }

    public JobOpening createJob(JobOpening job) {
        job.setId(null);
        return jobOpeningRepository.save(job);
    }

    public List<JobOpening> getAllJobs() {
        return jobOpeningRepository.findAll();
    }

    public JobOpening getJobById(Long id) {
        return jobOpeningRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job opening not found with ID: " + id));
    }

    public List<JobOpening> getOpenJobs() {
        return jobOpeningRepository.findByStatus("OPEN");
    }

    public JobOpening updateJob(Long id, JobOpening updatedJob) {
        JobOpening existingJob = getJobById(id);

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setDepartment(updatedJob.getDepartment());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setEmploymentType(updatedJob.getEmploymentType());
        existingJob.setClosingDate(updatedJob.getClosingDate());
        existingJob.setStatus(updatedJob.getStatus());
        existingJob.setDescription(updatedJob.getDescription());

        return jobOpeningRepository.save(existingJob);
    }

    public void deleteJob(Long id) {
        JobOpening existingJob = getJobById(id);
        jobOpeningRepository.delete(existingJob);
    }
}
