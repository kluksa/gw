package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Benefit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Benefit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BenefitRepository extends JpaRepository<Benefit, Long> {}
