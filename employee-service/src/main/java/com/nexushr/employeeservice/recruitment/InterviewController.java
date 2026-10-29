
package com.nexushr.employeeservice.recruitment;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Interview scheduleInterview(@RequestBody Interview interview) {
        return interviewService.scheduleInterview(interview);
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewService.getAllInterviews();
    }

    @GetMapping("/{id}")
    public Interview getInterviewById(@PathVariable Long id) {
        return interviewService.getInterviewById(id);
    }

    @GetMapping("/candidate/{candidateId}")
    public List<Interview> getInterviewsByCandidate(
            @PathVariable Long candidateId) {
        return interviewService.getInterviewsByCandidate(candidateId);
    }

    @PutMapping("/{id}")
    public Interview updateInterview(
            @PathVariable Long id,
            @RequestBody Interview interview) {
        return interviewService.updateInterview(id, interview);
    }

    @PatchMapping("/{id}/status")
    public Interview updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return interviewService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
    }
}
