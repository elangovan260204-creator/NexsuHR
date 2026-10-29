
package com.nexushr.employeeservice.payroll;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payroll generatePayroll(@RequestBody Payroll payroll) {
        return payrollService.generatePayroll(payroll);
    }

    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    @GetMapping("/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Payroll> getPayrollsByEmployee(@PathVariable Long employeeId) {
        return payrollService.getPayrollsByEmployee(employeeId);
    }

    @GetMapping("/{id}/payslip")
    public Payroll getPayslip(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    @PatchMapping("/{id}/pay")
    public Payroll markPaid(@PathVariable Long id) {
        return payrollService.markPaid(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(
            IllegalArgumentException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", exception.getMessage()));
    }
}
