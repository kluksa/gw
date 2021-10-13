package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TeamAllocation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TeamAllocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TeamAllocationRepository extends JpaRepository<TeamAllocation, Long> {}
