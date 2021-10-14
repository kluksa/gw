package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Notes;
import com.mycompany.myapp.repository.NotesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Notes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NotesResource {

    private final Logger log = LoggerFactory.getLogger(NotesResource.class);

    private static final String ENTITY_NAME = "notes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotesRepository notesRepository;

    public NotesResource(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }

    /**
     * {@code POST  /notes} : Create a new notes.
     *
     * @param notes the notes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new notes, or with status {@code 400 (Bad Request)} if the notes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/notes")
    public ResponseEntity<Notes> createNotes(@RequestBody Notes notes) throws URISyntaxException {
        log.debug("REST request to save Notes : {}", notes);
        if (notes.getId() != null) {
            throw new BadRequestAlertException("A new notes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Notes result = notesRepository.save(notes);
        return ResponseEntity
            .created(new URI("/api/notes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /notes/:id} : Updates an existing notes.
     *
     * @param id the id of the notes to save.
     * @param notes the notes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notes,
     * or with status {@code 400 (Bad Request)} if the notes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the notes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/notes/{id}")
    public ResponseEntity<Notes> updateNotes(@PathVariable(value = "id", required = false) final Long id, @RequestBody Notes notes)
        throws URISyntaxException {
        log.debug("REST request to update Notes : {}, {}", id, notes);
        if (notes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Notes result = notesRepository.save(notes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /notes/:id} : Partial updates given fields of an existing notes, field will ignore if it is null
     *
     * @param id the id of the notes to save.
     * @param notes the notes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notes,
     * or with status {@code 400 (Bad Request)} if the notes is not valid,
     * or with status {@code 404 (Not Found)} if the notes is not found,
     * or with status {@code 500 (Internal Server Error)} if the notes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/notes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Notes> partialUpdateNotes(@PathVariable(value = "id", required = false) final Long id, @RequestBody Notes notes)
        throws URISyntaxException {
        log.debug("REST request to partial update Notes partially : {}, {}", id, notes);
        if (notes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Notes> result = notesRepository
            .findById(notes.getId())
            .map(existingNotes -> {
                if (notes.getTimestamp() != null) {
                    existingNotes.setTimestamp(notes.getTimestamp());
                }
                if (notes.getNote() != null) {
                    existingNotes.setNote(notes.getNote());
                }

                return existingNotes;
            })
            .map(notesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notes.getId().toString())
        );
    }

    /**
     * {@code GET  /notes} : get all the notes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notes in body.
     */
    @GetMapping("/notes")
    public List<Notes> getAllNotes() {
        log.debug("REST request to get all Notes");
        return notesRepository.findAll();
    }

    /**
     * {@code GET  /notes/:id} : get the "id" notes.
     *
     * @param id the id of the notes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the notes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/notes/{id}")
    public ResponseEntity<Notes> getNotes(@PathVariable Long id) {
        log.debug("REST request to get Notes : {}", id);
        Optional<Notes> notes = notesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(notes);
    }

    /**
     * {@code DELETE  /notes/:id} : delete the "id" notes.
     *
     * @param id the id of the notes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNotes(@PathVariable Long id) {
        log.debug("REST request to delete Notes : {}", id);
        notesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
