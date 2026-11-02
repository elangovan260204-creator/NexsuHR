package com.nexushr.employeeservice.leave;

import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;
    private final CurrentUserService currentUserService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService,
            CurrentUserService currentUserService) {
        this.leaveRequestService = leaveRequestService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequest applyForLeave(@RequestBody LeaveRequest request) {
        return leaveRequestService.applyForLeave(request);
    }

    @GetMapping("/me")
    public List<LeaveRequest> ownLeaveHistory() {
        return leaveRequestService.getEmployeeLeaveHistory(
                currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/me/balance")
    public Map<String, Object> ownBalance() {
        return leaveRequestService.getBalance(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getEmployeeLeaveHistory(@PathVariable Long employeeId) {
        return leaveRequestService.getEmployeeLeaveHistory(employeeId);
    }

    @GetMapping("/employee/{employeeId}/balance")
    public Map<String, Object> getBalance(@PathVariable Long employeeId) {
        return leaveRequestService.getBalance(employeeId);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }

    @PutMapping("/{id}/status")
    public LeaveRequest updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return leaveRequestService.updateLeaveStatus(id, status);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }
}
