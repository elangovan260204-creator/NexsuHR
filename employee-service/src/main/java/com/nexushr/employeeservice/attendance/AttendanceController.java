package com.nexushr.employeeservice.attendance;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in/{employeeId}")
    public Attendance checkIn(@PathVariable Long employeeId) {
        return attendanceService.checkIn(employeeId);
    }

    @PutMapping("/check-out/{employeeId}")
    public Attendance checkOut(@PathVariable Long employeeId) {
        return attendanceService.checkOut(employeeId);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getEmployeeHistory(
            @PathVariable Long employeeId) {
        return attendanceService.getEmployeeHistory(employeeId);
    }

    @PutMapping("/mark")
public Attendance markAttendance(
        @RequestBody MarkAttendanceRequest request) {

    return attendanceService.markAttendance(
            request.getEmployeeId(),
            request.getDate(),
            request.getStatus()
    );
}

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalState(IllegalStateException exception) {
        return exception.getMessage();
    }

        @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgument(
            IllegalArgumentException exception) {
        return exception.getMessage();
    }
}
