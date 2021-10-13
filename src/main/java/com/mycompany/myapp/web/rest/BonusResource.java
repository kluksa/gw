package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Bonus;
import com.mycompany.myapp.repository.BonusRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Bonus}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BonusResource {

    private final Logger log = LoggerFactory.getLogger(BonusResource.class);

    private static final String ENTITY_NAME = "bonus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BonusRepository bonusRepository;

    public BonusResource(BonusRepository bonusRepository) {
        this.bonusRepository = bonusRepository;
    }

    /**
     * {@code POST  /bonuses} : Create a new bonus.
     *
     * @param bonus the bonus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bonus, or with status {@code 400 (Bad Request)} if the bonus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bonuses")
    public ResponseEntity<Bonus> createBonus(@RequestBody Bonus bonus) throws URISyntaxException {
        log.debug("REST request to save Bonus : {}", bonus);
        if (bonus.getId() != null) {
            throw new BadRequestAlertException("A new bonus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bonus result = bonusRepository.save(bonus);
        return ResponseEntity
            .created(new URI("/api/bonuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bonuses/:id} : Updates an existing bonus.
     *
     * @param id the id of the bonus to save.
     * @param bonus the bonus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bonus,
     * or with status {@code 400 (Bad Request)} if the bonus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bonus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bonuses/{id}")
    public ResponseEntity<Bonus> updateBonus(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bonus bonus)
        throws URISyntaxException {
        log.debug("REST request to update Bonus : {}, {}", id, bonus);
        if (bonus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bonus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bonusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bonus result = bonusRepository.save(bonus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bonus.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bonuses/:id} : Partial updates given fields of an existing bonus, field will ignore if it is null
     *
     * @param id the id of the bonus to save.
     * @param bonus the bonus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bonus,
     * or with status {@code 400 (Bad Request)} if the bonus is not valid,
     * or with status {@code 404 (Not Found)} if the bonus is not found,
     * or with status {@code 500 (Internal Server Error)} if the bonus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bonuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bonus> partialUpdateBonus(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bonus bonus)
        throws URISyntaxException {
        log.debug("REST request to partial update Bonus partially : {}, {}", id, bonus);
        if (bonus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bonus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bonusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bonus> result = bonusRepository
            .findById(bonus.getId())
            .map(existingBonus -> {
                if (bonus.getEffectiveDate() != null) {
                    existingBonus.setEffectiveDate(bonus.getEffectiveDate());
                }
                if (bonus.getAmount() != null) {
                    existingBonus.setAmount(bonus.getAmount());
                }
                if (bonus.getNote() != null) {
                    existingBonus.setNote(bonus.getNote());
                }

                return existingBonus;
            })
            .map(bonusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bonus.getId().toString())
        );
    }

    /**
     * {@code GET  /bonuses} : get all the bonuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bonuses in body.
     */
    @GetMapping("/bonuses")
    public List<Bonus> getAllBonuses() {
        log.debug("REST request to get all Bonuses");
        return bonusRepository.findAll();
    }

    /**
     * {@code GET  /bonuses/:id} : get the "id" bonus.
     *
     * @param id the id of the bonus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bonus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bonuses/{id}")
    public ResponseEntity<Bonus> getBonus(@PathVariable Long id) {
        log.debug("REST request to get Bonus : {}", id);
        Optional<Bonus> bonus = bonusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bonus);
    }

    /**
     * {@code DELETE  /bonuses/:id} : delete the "id" bonus.
     *
     * @param id the id of the bonus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bonuses/{id}")
    public ResponseEntity<Void> deleteBonus(@PathVariable Long id) {
        log.debug("REST request to delete Bonus : {}", id);
        bonusRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
