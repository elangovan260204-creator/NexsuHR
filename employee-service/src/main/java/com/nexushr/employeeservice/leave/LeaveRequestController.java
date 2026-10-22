
package com.nexushr.employeeservice.leave;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    // Employee applies for leave
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequest applyForLeave(
            @RequestBody LeaveRequest request) {
        return leaveRequestService.applyForLeave(request);
    }

    // Get one employee's leave history
    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getEmployeeLeaveHistory(
            @PathVariable Long employeeId) {
        return leaveRequestService.getEmployeeLeaveHistory(employeeId);
    }

    // Get all leave requests
    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }

    // Approve or reject a leave request
    @PutMapping("/{id}/status")
    public LeaveRequest updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return leaveRequestService.updateLeaveStatus(id, status);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgument(
            IllegalArgumentException exception) {
        return exception.getMessage();
    }
}
