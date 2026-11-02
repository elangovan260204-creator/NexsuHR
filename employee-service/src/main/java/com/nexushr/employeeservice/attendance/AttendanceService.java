package com.nexushr.employeeservice.attendance;

import com.nexushr.employeeservice.employee.EmployeeRepository;
import com.nexushr.employeeservice.exception.EmployeeNotFoundException;
import com.nexushr.employeeservice.exception.ForbiddenOperationException;
import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AttendanceService {

    private static final LocalTime LATE_AFTER = LocalTime.of(10, 0);

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;
    private final ZoneId zoneId;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            CurrentUserService currentUserService,
            @Value("${app.timezone:Asia/Kolkata}") String timezone) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.currentUserService = currentUserService;
        this.zoneId = ZoneId.of(timezone);
    }

    @Transactional
    public Attendance checkIn(Long employeeId) {
        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);
        ensureEmployeeExists(resolvedId);

        LocalDate today = LocalDate.now(zoneId);
        attendanceRepository.findByEmployeeIdAndAttendanceDate(resolvedId, today)
                .ifPresent(existing -> {
                    throw new IllegalStateException("Attendance already exists for today");
                });

        LocalDateTime now = LocalDateTime.now(zoneId);
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(resolvedId);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(now);
        attendance.setStatus(now.toLocalTime().isAfter(LATE_AFTER) ? "LATE" : "PRESENT");
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {
        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);
        LocalDate today = LocalDate.now(zoneId);

        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(resolvedId, today)
                .orElseThrow(() -> new IllegalStateException(
                        "Please check in before checking out"));

        if (attendance.getCheckOut() != null) {
            throw new IllegalStateException("You have already checked out today");
        }

        attendance.setCheckOut(LocalDateTime.now(zoneId));
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeHistory(Long employeeId) {
        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);
        return attendanceRepository.findByEmployeeId(resolvedId);
    }

    @Transactional
    public Attendance markAttendance(Long employeeId, LocalDate date, String status) {
        currentUserService.assertAdmin();
        ensureEmployeeExists(employeeId);

        if (date == null) {
            throw new IllegalArgumentException("Attendance date is required");
        }

        String normalizedStatus = normalizeStatus(status);
        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(employeeId, date)
                .orElseGet(Attendance::new);

        attendance.setEmployeeId(employeeId);
        attendance.setAttendanceDate(date);
        attendance.setStatus(normalizedStatus);

        if (List.of("ABSENT", "LEAVE").contains(normalizedStatus)) {
            attendance.setCheckIn(null);
            attendance.setCheckOut(null);
        }

        return attendanceRepository.save(attendance);
    }

    public Map<String, Object> monthlyReport(Long employeeId, int year, int month) {
        Long resolvedId = currentUserService.resolveEmployeeId(employeeId);
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<Attendance> records = attendanceRepository
                .findByEmployeeId(resolvedId)
                .stream()
                .filter(record -> {
                    LocalDate date = record.getAttendanceDate();
                    return date != null && !date.isBefore(start) && !date.isAfter(end);
                })
                .toList();

        long present = countStatus(records, "PRESENT", "LATE");
        long absent = countStatus(records, "ABSENT");
        long leave = countStatus(records, "LEAVE");
        long late = countStatus(records, "LATE");
        long classified = present + absent;
        double percentage = classified == 0
                ? 0.0
                : Math.round((present * 10000.0) / classified) / 100.0;

        return Map.of(
                "employeeId", resolvedId,
                "year", year,
                "month", month,
                "records", records,
                "presentDays", present,
                "absentDays", absent,
                "leaveDays", leave,
                "lateDays", late,
                "attendancePercentage", percentage
        );
    }

    private long countStatus(List<Attendance> records, String... statuses) {
        List<String> allowed = List.of(statuses);
        return records.stream()
                .filter(record -> record.getStatus() != null
                        && allowed.contains(record.getStatus().trim().toUpperCase(Locale.ROOT)))
                .count();
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!List.of("PRESENT", "ABSENT", "LEAVE", "LATE").contains(normalized)) {
            throw new IllegalArgumentException("Status must be PRESENT, ABSENT, LEAVE, or LATE");
        }
        return normalized;
    }

    private void ensureEmployeeExists(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new EmployeeNotFoundException("Employee not found with ID: " + employeeId);
        }
    }

    public void assertCanModify(Long employeeId) {
        if (!currentUserService.isAdmin()
                && !currentUserService.requireOwnEmployeeId().equals(employeeId)) {
            throw new ForbiddenOperationException("You can only access your own records");
        }
    }
}
