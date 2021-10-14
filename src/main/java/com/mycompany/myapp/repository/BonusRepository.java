package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Bonus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bonus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BonusRepository extends JpaRepository<Bonus, Long> {}
