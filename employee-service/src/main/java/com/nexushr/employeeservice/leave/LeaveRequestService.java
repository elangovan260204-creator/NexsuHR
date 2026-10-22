
package com.nexushr.employeeservice.leave;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @Transactional
    public LeaveRequest applyForLeave(LeaveRequest request) {

        if (request.getEmployeeId() == null) {
            throw new IllegalArgumentException(
                    "Employee ID is required");
        }

        if (request.getStartDate() == null
                || request.getEndDate() == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date");
        }

        if (request.getReason() == null
                || request.getReason().isBlank()) {
            throw new IllegalArgumentException(
                    "Leave reason is required");
        }

        request.setStatus("PENDING");

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getEmployeeLeaveHistory(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    @Transactional
    public LeaveRequest updateLeaveStatus(Long id, String status) {

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Leave status is required");
        }

        status = status.trim().toUpperCase();

        if (!List.of("APPROVED", "REJECTED").contains(status)) {
            throw new IllegalArgumentException(
                    "Status must be APPROVED or REJECTED");
        }

        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Leave request not found"));

        request.setStatus(status);

        return leaveRequestRepository.save(request);
    }
}
