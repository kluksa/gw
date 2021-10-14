package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TeamAllocation;
import com.mycompany.myapp.repository.TeamAllocationRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TeamAllocation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeamAllocationResource {

    private final Logger log = LoggerFactory.getLogger(TeamAllocationResource.class);

    private static final String ENTITY_NAME = "teamAllocation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamAllocationRepository teamAllocationRepository;

    public TeamAllocationResource(TeamAllocationRepository teamAllocationRepository) {
        this.teamAllocationRepository = teamAllocationRepository;
    }

    /**
     * {@code POST  /team-allocations} : Create a new teamAllocation.
     *
     * @param teamAllocation the teamAllocation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teamAllocation, or with status {@code 400 (Bad Request)} if the teamAllocation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/team-allocations")
    public ResponseEntity<TeamAllocation> createTeamAllocation(@RequestBody TeamAllocation teamAllocation) throws URISyntaxException {
        log.debug("REST request to save TeamAllocation : {}", teamAllocation);
        if (teamAllocation.getId() != null) {
            throw new BadRequestAlertException("A new teamAllocation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TeamAllocation result = teamAllocationRepository.save(teamAllocation);
        return ResponseEntity
            .created(new URI("/api/team-allocations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /team-allocations/:id} : Updates an existing teamAllocation.
     *
     * @param id the id of the teamAllocation to save.
     * @param teamAllocation the teamAllocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamAllocation,
     * or with status {@code 400 (Bad Request)} if the teamAllocation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teamAllocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/team-allocations/{id}")
    public ResponseEntity<TeamAllocation> updateTeamAllocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TeamAllocation teamAllocation
    ) throws URISyntaxException {
        log.debug("REST request to update TeamAllocation : {}, {}", id, teamAllocation);
        if (teamAllocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamAllocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamAllocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TeamAllocation result = teamAllocationRepository.save(teamAllocation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teamAllocation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /team-allocations/:id} : Partial updates given fields of an existing teamAllocation, field will ignore if it is null
     *
     * @param id the id of the teamAllocation to save.
     * @param teamAllocation the teamAllocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamAllocation,
     * or with status {@code 400 (Bad Request)} if the teamAllocation is not valid,
     * or with status {@code 404 (Not Found)} if the teamAllocation is not found,
     * or with status {@code 500 (Internal Server Error)} if the teamAllocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/team-allocations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TeamAllocation> partialUpdateTeamAllocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TeamAllocation teamAllocation
    ) throws URISyntaxException {
        log.debug("REST request to partial update TeamAllocation partially : {}, {}", id, teamAllocation);
        if (teamAllocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamAllocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamAllocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TeamAllocation> result = teamAllocationRepository
            .findById(teamAllocation.getId())
            .map(existingTeamAllocation -> {
                if (teamAllocation.getStart() != null) {
                    existingTeamAllocation.setStart(teamAllocation.getStart());
                }
                if (teamAllocation.getEnd() != null) {
                    existingTeamAllocation.setEnd(teamAllocation.getEnd());
                }
                if (teamAllocation.getNote() != null) {
                    existingTeamAllocation.setNote(teamAllocation.getNote());
                }

                return existingTeamAllocation;
            })
            .map(teamAllocationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teamAllocation.getId().toString())
        );
    }

    /**
     * {@code GET  /team-allocations} : get all the teamAllocations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teamAllocations in body.
     */
    @GetMapping("/team-allocations")
    public List<TeamAllocation> getAllTeamAllocations() {
        log.debug("REST request to get all TeamAllocations");
        return teamAllocationRepository.findAll();
    }

    /**
     * {@code GET  /team-allocations/:id} : get the "id" teamAllocation.
     *
     * @param id the id of the teamAllocation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teamAllocation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/team-allocations/{id}")
    public ResponseEntity<TeamAllocation> getTeamAllocation(@PathVariable Long id) {
        log.debug("REST request to get TeamAllocation : {}", id);
        Optional<TeamAllocation> teamAllocation = teamAllocationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(teamAllocation);
    }

    /**
     * {@code DELETE  /team-allocations/:id} : delete the "id" teamAllocation.
     *
     * @param id the id of the teamAllocation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/team-allocations/{id}")
    public ResponseEntity<Void> deleteTeamAllocation(@PathVariable Long id) {
        log.debug("REST request to delete TeamAllocation : {}", id);
        teamAllocationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
