
package com.nexushr.employeeservice.recruitment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterviewService {

    private static final List<String> VALID_STATUSES = List.of(
            "SCHEDULED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW"
    );

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;

    public InterviewService(
            InterviewRepository interviewRepository,
            CandidateRepository candidateRepository) {
        this.interviewRepository = interviewRepository;
        this.candidateRepository = candidateRepository;
    }

    @Transactional
    public Interview scheduleInterview(Interview interview) {
        interview.setId(null);

        if (interview.getCandidateId() == null) {
            throw new IllegalArgumentException("Candidate ID is required");
        }

        Candidate candidate = candidateRepository.findById(interview.getCandidateId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        if (interview.getInterviewDate() == null) {
            throw new IllegalArgumentException("Interview date is required");
        }

        if (interview.getInterviewTime() == null) {
            throw new IllegalArgumentException("Interview time is required");
        }

        if (interview.getInterviewerName() == null
                || interview.getInterviewerName().isBlank()) {
            throw new IllegalArgumentException("Interviewer name is required");
        }

        interview.setInterviewerName(interview.getInterviewerName().trim());
        interview.setStatus("SCHEDULED");

        candidate.setStatus("INTERVIEW");
        candidateRepository.save(candidate);

        return interviewRepository.save(interview);
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Interview not found with ID: " + id));
    }

    public List<Interview> getInterviewsByCandidate(Long candidateId) {
        return interviewRepository.findByCandidateId(candidateId);
    }

    @Transactional
    public Interview updateInterview(Long id, Interview updated) {
        Interview existing = getInterviewById(id);

        if (updated.getInterviewDate() != null) {
            existing.setInterviewDate(updated.getInterviewDate());
        }
        if (updated.getInterviewTime() != null) {
            existing.setInterviewTime(updated.getInterviewTime());
        }
        if (updated.getInterviewerName() != null
                && !updated.getInterviewerName().isBlank()) {
            existing.setInterviewerName(updated.getInterviewerName().trim());
        }
        existing.setMeetingLink(updated.getMeetingLink());
        existing.setNotes(updated.getNotes());

        return interviewRepository.save(existing);
    }

    @Transactional
    public Interview updateStatus(Long id, String status) {
        Interview interview = getInterviewById(id);

        if (status == null || !VALID_STATUSES.contains(status.trim().toUpperCase())) {
            throw new IllegalArgumentException(
                    "Invalid interview status. Use SCHEDULED, COMPLETED, CANCELLED, or NO_SHOW");
        }

        interview.setStatus(status.trim().toUpperCase());
        return interviewRepository.save(interview);
    }

    @Transactional
    public void deleteInterview(Long id) {
        Interview interview = getInterviewById(id);
        interviewRepository.delete(interview);
    }
}
