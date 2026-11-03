
package com.nexushr.employeeservice.leave;

import com.nexushr.employeeservice.exception.ForbiddenOperationException;
import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class LeaveRequestService {

    private static final int ANNUAL_ALLOWANCE = 20;

    private final LeaveRequestRepository leaveRequestRepository;
    private final CurrentUserService currentUserService;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            CurrentUserService currentUserService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public LeaveRequest applyForLeave(LeaveRequest request) {

        Long employeeId = currentUserService.resolveEmployeeId(request.getEmployeeId());
        request.setEmployeeId(employeeId);

        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new IllegalArgumentException("Leave reason is required");
        }

        String leaveType = normalizeLeaveType(request.getLeaveType());

        List<LeaveRequest> existingRequests =
                leaveRequestRepository.findByEmployeeId(employeeId);

        // Prevent overlapping pending or approved leave requests.
        boolean overlapping = existingRequests.stream()
                .filter(existing ->
                        "PENDING".equalsIgnoreCase(existing.getStatus())
                        || "APPROVED".equalsIgnoreCase(existing.getStatus()))
                .anyMatch(existing ->
                        !request.getEndDate().isBefore(existing.getStartDate())
                        && !request.getStartDate().isAfter(existing.getEndDate()));

        if (overlapping) {
            throw new IllegalArgumentException(
                    "You already have a pending or approved leave request for these dates");
        }

        // Check annual leave allowance.
        if ("ANNUAL".equals(leaveType)) {

            long reservedDays = existingRequests.stream()
                    .filter(existing ->
                            "ANNUAL".equalsIgnoreCase(existing.getLeaveType()))
                    .filter(existing ->
                            "APPROVED".equalsIgnoreCase(existing.getStatus())
                            || "PENDING".equalsIgnoreCase(existing.getStatus()))
                    .mapToLong(this::durationDays)
                    .sum();

            long requestedDays = durationDays(request);

            if (reservedDays + requestedDays > ANNUAL_ALLOWANCE) {
                throw new IllegalArgumentException(
                        "Annual leave allowance exceeded. Maximum allowance is 20 days");
            }
        }

        request.setReason(request.getReason().trim());
        request.setLeaveType(leaveType);
        request.setStatus("PENDING");

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getEmployeeLeaveHistory(Long employeeId) {

        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);

        return leaveRequestRepository.findByEmployeeId(resolvedId);
    }

    public List<LeaveRequest> getAllLeaveRequests() {

        if (currentUserService.isAdmin()) {
            return leaveRequestRepository.findAll();
        }

        return leaveRequestRepository.findByEmployeeId(
                currentUserService.requireOwnEmployeeId());
    }

    @Transactional
    public LeaveRequest updateLeaveStatus(Long id, String status) {

        currentUserService.assertAdmin();

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Leave status is required");
        }

        String normalized = status.trim().toUpperCase(Locale.ROOT);

        if (!List.of("APPROVED", "REJECTED").contains(normalized)) {
            throw new IllegalArgumentException(
                    "Status must be APPROVED or REJECTED");
        }

        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Leave request not found"));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending leave requests can be updated");
        }

        Long ownEmployeeId = currentUserService.findLinkedEmployeeId();

        if (ownEmployeeId != null
                && ownEmployeeId.equals(request.getEmployeeId())) {
            throw new ForbiddenOperationException(
                    "You cannot approve or reject your own leave request");
        }

        // Recheck annual allowance when Admin approves.
        if ("APPROVED".equals(normalized)
                && "ANNUAL".equalsIgnoreCase(request.getLeaveType())) {

            List<LeaveRequest> employeeRequests =
                    leaveRequestRepository.findByEmployeeId(request.getEmployeeId());

            long approvedDays = employeeRequests.stream()
                    .filter(existing ->
                            !existing.getId().equals(request.getId()))
                    .filter(existing ->
                            "ANNUAL".equalsIgnoreCase(existing.getLeaveType()))
                    .filter(existing ->
                            "APPROVED".equalsIgnoreCase(existing.getStatus()))
                    .mapToLong(this::durationDays)
                    .sum();

            if (approvedDays + durationDays(request) > ANNUAL_ALLOWANCE) {
                throw new IllegalArgumentException(
                        "Cannot approve. Employee annual leave allowance would be exceeded");
            }
        }

        request.setStatus(normalized);

        return leaveRequestRepository.save(request);
    }

    public Map<String, Object> getBalance(Long employeeId) {

        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);

        long usedDays = leaveRequestRepository.findByEmployeeId(resolvedId)
                .stream()
                .filter(request ->
                        "APPROVED".equalsIgnoreCase(request.getStatus()))
                .filter(request ->
                        "ANNUAL".equalsIgnoreCase(request.getLeaveType()))
                .mapToLong(this::durationDays)
                .sum();

        return Map.of(
                "employeeId", resolvedId,
                "leaveType", "ANNUAL",
                "allowance", ANNUAL_ALLOWANCE,
                "usedDays", usedDays,
                "remainingDays",
                Math.max(0, ANNUAL_ALLOWANCE - usedDays)
        );
    }

    private long durationDays(LeaveRequest request) {

        if (request.getStartDate() == null
                || request.getEndDate() == null) {
            return 0;
        }

        return ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()) + 1;
    }

    private String normalizeLeaveType(String leaveType) {

        String normalized = leaveType == null || leaveType.isBlank()
                ? "ANNUAL"
                : leaveType.trim().toUpperCase(Locale.ROOT);

        if (!List.of("ANNUAL", "SICK", "CASUAL", "UNPAID")
                .contains(normalized)) {
            throw new IllegalArgumentException(
                    "Leave type must be ANNUAL, SICK, CASUAL, or UNPAID");
        }

        return normalized;
    }
}
