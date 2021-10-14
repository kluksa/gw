package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Notes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Notes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotesRepository extends JpaRepository<Notes, Long> {}
