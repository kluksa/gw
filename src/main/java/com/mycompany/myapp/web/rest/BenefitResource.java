package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Benefit;
import com.mycompany.myapp.repository.BenefitRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Benefit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BenefitResource {

    private final Logger log = LoggerFactory.getLogger(BenefitResource.class);

    private static final String ENTITY_NAME = "benefit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BenefitRepository benefitRepository;

    public BenefitResource(BenefitRepository benefitRepository) {
        this.benefitRepository = benefitRepository;
    }

    /**
     * {@code POST  /benefits} : Create a new benefit.
     *
     * @param benefit the benefit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new benefit, or with status {@code 400 (Bad Request)} if the benefit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/benefits")
    public ResponseEntity<Benefit> createBenefit(@RequestBody Benefit benefit) throws URISyntaxException {
        log.debug("REST request to save Benefit : {}", benefit);
        if (benefit.getId() != null) {
            throw new BadRequestAlertException("A new benefit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Benefit result = benefitRepository.save(benefit);
        return ResponseEntity
            .created(new URI("/api/benefits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /benefits/:id} : Updates an existing benefit.
     *
     * @param id the id of the benefit to save.
     * @param benefit the benefit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated benefit,
     * or with status {@code 400 (Bad Request)} if the benefit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the benefit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/benefits/{id}")
    public ResponseEntity<Benefit> updateBenefit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Benefit benefit)
        throws URISyntaxException {
        log.debug("REST request to update Benefit : {}, {}", id, benefit);
        if (benefit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, benefit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!benefitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Benefit result = benefitRepository.save(benefit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, benefit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /benefits/:id} : Partial updates given fields of an existing benefit, field will ignore if it is null
     *
     * @param id the id of the benefit to save.
     * @param benefit the benefit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated benefit,
     * or with status {@code 400 (Bad Request)} if the benefit is not valid,
     * or with status {@code 404 (Not Found)} if the benefit is not found,
     * or with status {@code 500 (Internal Server Error)} if the benefit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/benefits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Benefit> partialUpdateBenefit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Benefit benefit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Benefit partially : {}, {}", id, benefit);
        if (benefit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, benefit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!benefitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Benefit> result = benefitRepository
            .findById(benefit.getId())
            .map(existingBenefit -> {
                if (benefit.getType() != null) {
                    existingBenefit.setType(benefit.getType());
                }
                if (benefit.getEffectiveDate() != null) {
                    existingBenefit.setEffectiveDate(benefit.getEffectiveDate());
                }
                if (benefit.getValue() != null) {
                    existingBenefit.setValue(benefit.getValue());
                }
                if (benefit.getEndDate() != null) {
                    existingBenefit.setEndDate(benefit.getEndDate());
                }

                return existingBenefit;
            })
            .map(benefitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, benefit.getId().toString())
        );
    }

    /**
     * {@code GET  /benefits} : get all the benefits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of benefits in body.
     */
    @GetMapping("/benefits")
    public List<Benefit> getAllBenefits() {
        log.debug("REST request to get all Benefits");
        return benefitRepository.findAll();
    }

    /**
     * {@code GET  /benefits/:id} : get the "id" benefit.
     *
     * @param id the id of the benefit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the benefit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/benefits/{id}")
    public ResponseEntity<Benefit> getBenefit(@PathVariable Long id) {
        log.debug("REST request to get Benefit : {}", id);
        Optional<Benefit> benefit = benefitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(benefit);
    }

    /**
     * {@code DELETE  /benefits/:id} : delete the "id" benefit.
     *
     * @param id the id of the benefit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/benefits/{id}")
    public ResponseEntity<Void> deleteBenefit(@PathVariable Long id) {
        log.debug("REST request to delete Benefit : {}", id);
        benefitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
