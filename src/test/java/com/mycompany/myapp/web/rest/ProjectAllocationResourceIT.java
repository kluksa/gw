package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ProjectAllocation;
import com.mycompany.myapp.repository.ProjectAllocationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProjectAllocationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProjectAllocationResourceIT {

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/project-allocations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectAllocationRepository projectAllocationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectAllocationMockMvc;

    private ProjectAllocation projectAllocation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectAllocation createEntity(EntityManager em) {
        ProjectAllocation projectAllocation = new ProjectAllocation().start(DEFAULT_START).end(DEFAULT_END).note(DEFAULT_NOTE);
        return projectAllocation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectAllocation createUpdatedEntity(EntityManager em) {
        ProjectAllocation projectAllocation = new ProjectAllocation().start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);
        return projectAllocation;
    }

    @BeforeEach
    public void initTest() {
        projectAllocation = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectAllocation() throws Exception {
        int databaseSizeBeforeCreate = projectAllocationRepository.findAll().size();
        // Create the ProjectAllocation
        restProjectAllocationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectAllocation testProjectAllocation = projectAllocationList.get(projectAllocationList.size() - 1);
        assertThat(testProjectAllocation.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testProjectAllocation.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testProjectAllocation.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createProjectAllocationWithExistingId() throws Exception {
        // Create the ProjectAllocation with an existing ID
        projectAllocation.setId(1L);

        int databaseSizeBeforeCreate = projectAllocationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectAllocationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProjectAllocations() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        // Get all the projectAllocationList
        restProjectAllocationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectAllocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }

    @Test
    @Transactional
    void getProjectAllocation() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        // Get the projectAllocation
        restProjectAllocationMockMvc
            .perform(get(ENTITY_API_URL_ID, projectAllocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectAllocation.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }

    @Test
    @Transactional
    void getNonExistingProjectAllocation() throws Exception {
        // Get the projectAllocation
        restProjectAllocationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProjectAllocation() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();

        // Update the projectAllocation
        ProjectAllocation updatedProjectAllocation = projectAllocationRepository.findById(projectAllocation.getId()).get();
        // Disconnect from session so that the updates on updatedProjectAllocation are not directly saved in db
        em.detach(updatedProjectAllocation);
        updatedProjectAllocation.start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);

        restProjectAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectAllocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectAllocation))
            )
            .andExpect(status().isOk());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
        ProjectAllocation testProjectAllocation = projectAllocationList.get(projectAllocationList.size() - 1);
        assertThat(testProjectAllocation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testProjectAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testProjectAllocation.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectAllocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectAllocationWithPatch() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();

        // Update the projectAllocation using partial update
        ProjectAllocation partialUpdatedProjectAllocation = new ProjectAllocation();
        partialUpdatedProjectAllocation.setId(projectAllocation.getId());

        partialUpdatedProjectAllocation.end(UPDATED_END);

        restProjectAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectAllocation))
            )
            .andExpect(status().isOk());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
        ProjectAllocation testProjectAllocation = projectAllocationList.get(projectAllocationList.size() - 1);
        assertThat(testProjectAllocation.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testProjectAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testProjectAllocation.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateProjectAllocationWithPatch() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();

        // Update the projectAllocation using partial update
        ProjectAllocation partialUpdatedProjectAllocation = new ProjectAllocation();
        partialUpdatedProjectAllocation.setId(projectAllocation.getId());

        partialUpdatedProjectAllocation.start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);

        restProjectAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectAllocation))
            )
            .andExpect(status().isOk());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
        ProjectAllocation testProjectAllocation = projectAllocationList.get(projectAllocationList.size() - 1);
        assertThat(testProjectAllocation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testProjectAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testProjectAllocation.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectAllocation() throws Exception {
        int databaseSizeBeforeUpdate = projectAllocationRepository.findAll().size();
        projectAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectAllocation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectAllocation in the database
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectAllocation() throws Exception {
        // Initialize the database
        projectAllocationRepository.saveAndFlush(projectAllocation);

        int databaseSizeBeforeDelete = projectAllocationRepository.findAll().size();

        // Delete the projectAllocation
        restProjectAllocationMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectAllocation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectAllocation> projectAllocationList = projectAllocationRepository.findAll();
        assertThat(projectAllocationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
