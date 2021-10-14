package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProjectAllocation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProjectAllocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectAllocationRepository extends JpaRepository<ProjectAllocation, Long> {}
