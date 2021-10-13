package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ProjectAllocation;
import com.mycompany.myapp.repository.ProjectAllocationRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProjectAllocation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectAllocationResource {

    private final Logger log = LoggerFactory.getLogger(ProjectAllocationResource.class);

    private static final String ENTITY_NAME = "projectAllocation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectAllocationRepository projectAllocationRepository;

    public ProjectAllocationResource(ProjectAllocationRepository projectAllocationRepository) {
        this.projectAllocationRepository = projectAllocationRepository;
    }

    /**
     * {@code POST  /project-allocations} : Create a new projectAllocation.
     *
     * @param projectAllocation the projectAllocation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectAllocation, or with status {@code 400 (Bad Request)} if the projectAllocation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-allocations")
    public ResponseEntity<ProjectAllocation> createProjectAllocation(@RequestBody ProjectAllocation projectAllocation)
        throws URISyntaxException {
        log.debug("REST request to save ProjectAllocation : {}", projectAllocation);
        if (projectAllocation.getId() != null) {
            throw new BadRequestAlertException("A new projectAllocation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectAllocation result = projectAllocationRepository.save(projectAllocation);
        return ResponseEntity
            .created(new URI("/api/project-allocations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-allocations/:id} : Updates an existing projectAllocation.
     *
     * @param id the id of the projectAllocation to save.
     * @param projectAllocation the projectAllocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectAllocation,
     * or with status {@code 400 (Bad Request)} if the projectAllocation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectAllocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-allocations/{id}")
    public ResponseEntity<ProjectAllocation> updateProjectAllocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProjectAllocation projectAllocation
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectAllocation : {}, {}", id, projectAllocation);
        if (projectAllocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectAllocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectAllocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectAllocation result = projectAllocationRepository.save(projectAllocation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectAllocation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-allocations/:id} : Partial updates given fields of an existing projectAllocation, field will ignore if it is null
     *
     * @param id the id of the projectAllocation to save.
     * @param projectAllocation the projectAllocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectAllocation,
     * or with status {@code 400 (Bad Request)} if the projectAllocation is not valid,
     * or with status {@code 404 (Not Found)} if the projectAllocation is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectAllocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-allocations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectAllocation> partialUpdateProjectAllocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProjectAllocation projectAllocation
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectAllocation partially : {}, {}", id, projectAllocation);
        if (projectAllocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectAllocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectAllocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectAllocation> result = projectAllocationRepository
            .findById(projectAllocation.getId())
            .map(existingProjectAllocation -> {
                if (projectAllocation.getStart() != null) {
                    existingProjectAllocation.setStart(projectAllocation.getStart());
                }
                if (projectAllocation.getEnd() != null) {
                    existingProjectAllocation.setEnd(projectAllocation.getEnd());
                }
                if (projectAllocation.getNote() != null) {
                    existingProjectAllocation.setNote(projectAllocation.getNote());
                }

                return existingProjectAllocation;
            })
            .map(projectAllocationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectAllocation.getId().toString())
        );
    }

    /**
     * {@code GET  /project-allocations} : get all the projectAllocations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectAllocations in body.
     */
    @GetMapping("/project-allocations")
    public List<ProjectAllocation> getAllProjectAllocations() {
        log.debug("REST request to get all ProjectAllocations");
        return projectAllocationRepository.findAll();
    }

    /**
     * {@code GET  /project-allocations/:id} : get the "id" projectAllocation.
     *
     * @param id the id of the projectAllocation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectAllocation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-allocations/{id}")
    public ResponseEntity<ProjectAllocation> getProjectAllocation(@PathVariable Long id) {
        log.debug("REST request to get ProjectAllocation : {}", id);
        Optional<ProjectAllocation> projectAllocation = projectAllocationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(projectAllocation);
    }

    /**
     * {@code DELETE  /project-allocations/:id} : delete the "id" projectAllocation.
     *
     * @param id the id of the projectAllocation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-allocations/{id}")
    public ResponseEntity<Void> deleteProjectAllocation(@PathVariable Long id) {
        log.debug("REST request to delete ProjectAllocation : {}", id);
        projectAllocationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
