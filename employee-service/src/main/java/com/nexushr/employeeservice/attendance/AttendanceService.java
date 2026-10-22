package com.nexushr.employeeservice.attendance;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Transactional
    public Attendance checkIn(Long employeeId) {

        LocalDate today = LocalDate.now();

        boolean alreadyExists = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(employeeId, today)
                .isPresent();

        if (alreadyExists) {
            throw new IllegalStateException(
                    "Attendance already exists for today"
            );
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(LocalDateTime.now());
        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElseThrow(() -> new IllegalStateException(
                        "Please check in before checking out"
                ));

        if (attendance.getCheckOut() != null) {
            throw new IllegalStateException(
                    "You have already checked out today"
            );
        }

        attendance.setCheckOut(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeHistory(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    @Transactional
public Attendance markAttendance(
        Long employeeId,
        LocalDate date,
        String status) {

    // Validate status
    if (status == null || status.isBlank()) {
        throw new IllegalArgumentException("Status is required");
    }

    status = status.trim().toUpperCase();

    if (!List.of("PRESENT", "ABSENT", "LEAVE").contains(status)) {
        throw new IllegalArgumentException(
                "Status must be PRESENT, ABSENT, or LEAVE"
        );
    }

    Attendance attendance = attendanceRepository
            .findByEmployeeIdAndAttendanceDate(employeeId, date)
            .orElseGet(Attendance::new);

    attendance.setEmployeeId(employeeId);
    attendance.setAttendanceDate(date);
    attendance.setStatus(status);

    if (!"PRESENT".equals(status)) {
        attendance.setCheckIn(null);
        attendance.setCheckOut(null);
    }

    return attendanceRepository.save(attendance);
}
    
}
