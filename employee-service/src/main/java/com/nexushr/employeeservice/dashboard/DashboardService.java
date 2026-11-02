package com.nexushr.employeeservice.dashboard;

import com.nexushr.employeeservice.attendance.Attendance;
import com.nexushr.employeeservice.attendance.AttendanceRepository;
import com.nexushr.employeeservice.employee.EmployeeRepository;
import com.nexushr.employeeservice.leave.LeaveRequestRepository;
import com.nexushr.employeeservice.payroll.Payroll;
import com.nexushr.employeeservice.payroll.PayrollRepository;
import com.nexushr.employeeservice.performance.PerformanceRepository;
import com.nexushr.employeeservice.recruitment.CandidateRepository;
import com.nexushr.employeeservice.recruitment.JobOpeningRepository;
import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DashboardService {

    private final CurrentUserService currentUserService;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final PerformanceRepository performanceRepository;
    private final JobOpeningRepository jobOpeningRepository;
    private final CandidateRepository candidateRepository;
    private final ZoneId zoneId;

    public DashboardService(
            CurrentUserService currentUserService,
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            LeaveRequestRepository leaveRequestRepository,
            PayrollRepository payrollRepository,
            PerformanceRepository performanceRepository,
            JobOpeningRepository jobOpeningRepository,
            CandidateRepository candidateRepository,
            @Value("${app.timezone:Asia/Kolkata}") String timezone) {
        this.currentUserService = currentUserService;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.performanceRepository = performanceRepository;
        this.jobOpeningRepository = jobOpeningRepository;
        this.candidateRepository = candidateRepository;
        this.zoneId = ZoneId.of(timezone);
    }

    public Map<String, Object> adminSummary() {
        currentUserService.assertAdmin();

        LocalDate today = LocalDate.now(zoneId);
        long totalEmployees = employeeRepository.count();
        List<Attendance> todayRecords = attendanceRepository.findByAttendanceDate(today);

        long presentToday = countStatus(todayRecords, "PRESENT", "LATE");
        long absentToday = countStatus(todayRecords, "ABSENT");
        long onLeaveToday = countStatus(todayRecords, "LEAVE");
        long markedToday = todayRecords.size();

        List<Payroll> payrolls = payrollRepository.findAll();
        long paidPayrolls = payrolls.stream()
                .filter(item -> "PAID".equalsIgnoreCase(item.getStatus()))
                .count();
        BigDecimal netPayout = payrolls.stream()
                .map(item -> item.getNetSalary() == null ? BigDecimal.ZERO : item.getNetSalary())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("today", today.toString());
        response.put("totalEmployees", totalEmployees);
        response.put("presentToday", presentToday);
        response.put("absentToday", absentToday);
        response.put("onLeaveToday", onLeaveToday);
        response.put("unmarkedToday", Math.max(0, totalEmployees - markedToday));
        response.put("pendingLeaveRequests", leaveRequestRepository.findByStatus("PENDING").size());
        response.put("payrollRuns", payrolls.size());
        response.put("paidPayrolls", paidPayrolls);
        response.put("netPayout", netPayout);
        response.put("performanceReviews", performanceRepository.count());
        response.put("openJobs", jobOpeningRepository.findByStatus("OPEN").size());
        response.put("totalCandidates", candidateRepository.count());
        return response;
    }

    private long countStatus(List<Attendance> records, String... statuses) {
        List<String> allowed = List.of(statuses);
        return records.stream()
                .filter(record -> record.getStatus() != null
                        && allowed.contains(record.getStatus().trim().toUpperCase(Locale.ROOT)))
                .count();
    }
}
