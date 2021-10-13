package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Payroll;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Payroll entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {}
