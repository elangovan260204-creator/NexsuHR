
package com.nexushr.employeeservice.ai;

import com.nexushr.employeeservice.attendance.Attendance;
import com.nexushr.employeeservice.attendance.AttendanceRepository;
import com.nexushr.employeeservice.employee.EmployeeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-insights")
public class AIInsightsController {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final GeminiService geminiService;

    public AIInsightsController(
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            GeminiService geminiService) {

        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.geminiService = geminiService;
    }

    // Existing live database summary endpoint
    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        return buildSummary();
    }

    // New Gemini AI insights endpoint
    @GetMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateInsights() {

        try {
            // Step 1: Fetch actual database metrics
            Map<String, Object> summary = buildSummary();

            // Step 2: Create prompt using real database values
            String prompt = """
                    Analyze the following real workforce data
                    from the NexusHR PostgreSQL database.

                    Total employees: %s
                    Total attendance records: %s
                    Present records: %s
                    Absent records: %s
                    Classified records: %s
                    Attendance rate: %s%%

                    Provide your response with these sections:

                    1. Workforce Overview
                    2. Attendance Analysis
                    3. Key Observations
                    4. Recommended HR Actions
                    5. Data Limitations

                    Important instructions:
                    - Use only the supplied data.
                    - Do not invent employee names or statistics.
                    - Do not create employee retention risk scores.
                    - Do not invent skill gap percentages.
                    - Explain that attendance rate is calculated
                      using present and absent records only.
                    - Mention when there is insufficient data.
                    - Give practical and professional HR recommendations.
                    """.formatted(
                    summary.get("totalEmployees"),
                    summary.get("totalAttendanceRecords"),
                    summary.get("presentRecords"),
                    summary.get("absentRecords"),
                    summary.get("classifiedRecords"),
                    summary.get("attendanceRate")
            );

            // Step 3: Send prompt to Gemini
            String insight = geminiService.generateInsight(prompt);

            // Step 4: Return database metrics and AI response
            Map<String, Object> response = new HashMap<>();
            response.put("summary", summary);
            response.put("insight", insight);

            return ResponseEntity.ok(response);

        } catch (IllegalStateException exception) {

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "message",
                            exception.getMessage()
                    ));

        } catch (Exception exception) {

            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of(
                            "message",
                            "Unable to generate AI insights. Check Gemini API configuration."
                    ));
        }
    }

    // Calculate metrics directly from PostgreSQL
    private Map<String, Object> buildSummary() {

        long totalEmployees = employeeRepository.count();

        List<Attendance> records = attendanceRepository.findAll();

        long totalAttendanceRecords = records.size();
        long presentRecords = 0;
        long absentRecords = 0;

        for (Attendance attendance : records) {

            String status = attendance.getStatus();

            if (status != null) {

                String normalizedStatus =
                        status.trim().toLowerCase(Locale.ROOT);

                if (normalizedStatus.equals("present")) {
                    presentRecords++;
                } else if (normalizedStatus.equals("absent")) {
                    absentRecords++;
                }
            }
        }

        long classifiedRecords = presentRecords + absentRecords;

        double attendanceRate = classifiedRecords == 0
                ? 0.0
                : Math.round(
                    (presentRecords * 10000.0) / classifiedRecords
                ) / 100.0;

        Map<String, Object> response = new HashMap<>();

        response.put("totalEmployees", totalEmployees);
        response.put("totalAttendanceRecords", totalAttendanceRecords);
        response.put("presentRecords", presentRecords);
        response.put("absentRecords", absentRecords);
        response.put("classifiedRecords", classifiedRecords);
        response.put("attendanceRate", attendanceRate);

        return response;
    }
}
