package com.nexushr.employeeservice.payroll;

import com.nexushr.employeeservice.exception.ForbiddenOperationException;
import com.nexushr.employeeservice.security.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;
    private final CurrentUserService currentUserService;

    public PayrollController(
            PayrollService payrollService,
            CurrentUserService currentUserService) {
        this.payrollService = payrollService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payroll generatePayroll(@RequestBody Payroll payroll) {
        currentUserService.assertAdmin();
        return payrollService.generatePayroll(payroll);
    }

    @GetMapping
    public List<Payroll> getAllPayrolls() {
        currentUserService.assertAdmin();
        return payrollService.getAllPayrolls();
    }

    @GetMapping("/me")
    public List<Payroll> ownPayrolls() {
        return payrollService.getPayrollsByEmployee(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/me/{id}")
    public Payroll ownPayroll(@PathVariable Long id) {
        Payroll payroll = payrollService.getPayrollById(id);
        currentUserService.assertCanAccessEmployee(payroll.getEmployeeId());
        return payroll;
    }

    @GetMapping("/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        Payroll payroll = payrollService.getPayrollById(id);
        if (!currentUserService.isAdmin()) {
            throw new ForbiddenOperationException("Administrator access is required");
        }
        return payroll;
    }

    @GetMapping("/employee/{employeeId}")
    public List<Payroll> getPayrollsByEmployee(@PathVariable Long employeeId) {
        currentUserService.assertAdmin();
        return payrollService.getPayrollsByEmployee(employeeId);
    }

    @GetMapping("/{id}/payslip")
    public Payroll getPayslip(@PathVariable Long id) {
        currentUserService.assertAdmin();
        return payrollService.getPayrollById(id);
    }

    @GetMapping("/me/{id}/payslip")
    public Payroll ownPayslip(@PathVariable Long id) {
        Payroll payroll = payrollService.getPayrollById(id);
        currentUserService.assertCanAccessEmployee(payroll.getEmployeeId());
        return payroll;
    }

    @PatchMapping("/{id}/pay")
    public Payroll markPaid(@PathVariable Long id) {
        currentUserService.assertAdmin();
        return payrollService.markPaid(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePayroll(@PathVariable Long id) {
        currentUserService.assertAdmin();
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
