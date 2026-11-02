package com.nexushr.employeeservice.attendance;

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

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final CurrentUserService currentUserService;

    public AttendanceController(
            AttendanceService attendanceService,
            CurrentUserService currentUserService) {
        this.attendanceService = attendanceService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/me/check-in")
    public Attendance checkInOwn() {
        return attendanceService.checkIn(currentUserService.requireOwnEmployeeId());
    }

    @PutMapping("/me/check-out")
    public Attendance checkOutOwn() {
        return attendanceService.checkOut(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/me")
    public List<Attendance> ownHistory() {
        return attendanceService.getEmployeeHistory(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/me/monthly")
    public Map<String, Object> ownMonthlyReport(
            @RequestParam int year,
            @RequestParam int month) {
        return attendanceService.monthlyReport(
                currentUserService.requireOwnEmployeeId(), year, month);
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
    public List<Attendance> getEmployeeHistory(@PathVariable Long employeeId) {
        return attendanceService.getEmployeeHistory(employeeId);
    }

    @GetMapping("/employee/{employeeId}/monthly")
    public Map<String, Object> monthlyReport(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        return attendanceService.monthlyReport(employeeId, year, month);
    }

    @PutMapping("/mark")
    public Attendance markAttendance(@RequestBody MarkAttendanceRequest request) {
        return attendanceService.markAttendance(
                request.getEmployeeId(),
                request.getDate(),
                request.getStatus());
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalState(IllegalStateException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }
}
