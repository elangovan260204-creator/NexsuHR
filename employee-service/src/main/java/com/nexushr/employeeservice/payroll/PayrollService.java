
package com.nexushr.employeeservice.payroll;

import com.nexushr.employeeservice.employee.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class PayrollService {

    private static final BigDecimal TAX_THRESHOLD = new BigDecimal("50000");
    private static final BigDecimal HIGH_TAX_RATE = new BigDecimal("0.10");
    private static final BigDecimal LOW_TAX_RATE = new BigDecimal("0.05");

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public Payroll generatePayroll(Payroll payroll) {
        payroll.setId(null);

        if (payroll.getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        employeeRepository.findById(payroll.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        if (payroll.getPayPeriod() == null || payroll.getPayPeriod().isBlank()) {
            throw new IllegalArgumentException("Pay period is required (YYYY-MM)");
        }

        if (!payroll.getPayPeriod().matches("\\d{4}-\\d{2}")) {
            throw new IllegalArgumentException("Pay period must be in YYYY-MM format");
        }

        if (payroll.getBasicSalary() == null
                || payroll.getBasicSalary().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Basic salary must be greater than 0");
        }

        payrollRepository.findByEmployeeIdAndPayPeriod(
                        payroll.getEmployeeId(), payroll.getPayPeriod())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Payroll already exists for this employee and pay period");
                });

        applyCalculation(payroll);
        payroll.setStatus("CALCULATED");
        payroll.setGeneratedOn(LocalDate.now());

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Payroll not found with ID: " + id));
    }

    public List<Payroll> getPayrollsByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public Payroll markPaid(Long id) {
        Payroll payroll = getPayrollById(id);
        payroll.setStatus("PAID");
        return payrollRepository.save(payroll);
    }

    @Transactional
    public void deletePayroll(Long id) {
        Payroll payroll = getPayrollById(id);
        payrollRepository.delete(payroll);
    }

    private void applyCalculation(Payroll payroll) {
        BigDecimal hra = zeroIfNull(payroll.getHra());
        BigDecimal allowances = zeroIfNull(payroll.getAllowances());
        BigDecimal deductions = zeroIfNull(payroll.getDeductions());
        BigDecimal basic = payroll.getBasicSalary().setScale(2, RoundingMode.HALF_UP);

        BigDecimal gross = basic.add(hra).add(allowances);
        BigDecimal taxable = gross.subtract(deductions);

        if (taxable.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Deductions cannot exceed gross salary");
        }

        BigDecimal taxRate = taxable.compareTo(TAX_THRESHOLD) > 0
                ? HIGH_TAX_RATE
                : LOW_TAX_RATE;

        BigDecimal tax = taxable.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal net = taxable.subtract(tax).setScale(2, RoundingMode.HALF_UP);

        payroll.setHra(hra.setScale(2, RoundingMode.HALF_UP));
        payroll.setAllowances(allowances.setScale(2, RoundingMode.HALF_UP));
        payroll.setDeductions(deductions.setScale(2, RoundingMode.HALF_UP));
        payroll.setBasicSalary(basic);
        payroll.setTax(tax);
        payroll.setNetSalary(net);
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
