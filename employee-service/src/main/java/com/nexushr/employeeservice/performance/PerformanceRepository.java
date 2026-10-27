
package com.nexushr.employeeservice.performance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    List<Performance> findByEmployeeId(Long employeeId);
}
