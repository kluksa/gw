package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TeamAllocation;
import com.mycompany.myapp.repository.TeamAllocationRepository;
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
 * Integration tests for the {@link TeamAllocationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TeamAllocationResourceIT {

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/team-allocations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TeamAllocationRepository teamAllocationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeamAllocationMockMvc;

    private TeamAllocation teamAllocation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeamAllocation createEntity(EntityManager em) {
        TeamAllocation teamAllocation = new TeamAllocation().start(DEFAULT_START).end(DEFAULT_END).note(DEFAULT_NOTE);
        return teamAllocation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeamAllocation createUpdatedEntity(EntityManager em) {
        TeamAllocation teamAllocation = new TeamAllocation().start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);
        return teamAllocation;
    }

    @BeforeEach
    public void initTest() {
        teamAllocation = createEntity(em);
    }

    @Test
    @Transactional
    void createTeamAllocation() throws Exception {
        int databaseSizeBeforeCreate = teamAllocationRepository.findAll().size();
        // Create the TeamAllocation
        restTeamAllocationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isCreated());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeCreate + 1);
        TeamAllocation testTeamAllocation = teamAllocationList.get(teamAllocationList.size() - 1);
        assertThat(testTeamAllocation.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testTeamAllocation.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testTeamAllocation.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createTeamAllocationWithExistingId() throws Exception {
        // Create the TeamAllocation with an existing ID
        teamAllocation.setId(1L);

        int databaseSizeBeforeCreate = teamAllocationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeamAllocationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTeamAllocations() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        // Get all the teamAllocationList
        restTeamAllocationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teamAllocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }

    @Test
    @Transactional
    void getTeamAllocation() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        // Get the teamAllocation
        restTeamAllocationMockMvc
            .perform(get(ENTITY_API_URL_ID, teamAllocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teamAllocation.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }

    @Test
    @Transactional
    void getNonExistingTeamAllocation() throws Exception {
        // Get the teamAllocation
        restTeamAllocationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTeamAllocation() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();

        // Update the teamAllocation
        TeamAllocation updatedTeamAllocation = teamAllocationRepository.findById(teamAllocation.getId()).get();
        // Disconnect from session so that the updates on updatedTeamAllocation are not directly saved in db
        em.detach(updatedTeamAllocation);
        updatedTeamAllocation.start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);

        restTeamAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTeamAllocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTeamAllocation))
            )
            .andExpect(status().isOk());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
        TeamAllocation testTeamAllocation = teamAllocationList.get(teamAllocationList.size() - 1);
        assertThat(testTeamAllocation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeamAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testTeamAllocation.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teamAllocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamAllocation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeamAllocationWithPatch() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();

        // Update the teamAllocation using partial update
        TeamAllocation partialUpdatedTeamAllocation = new TeamAllocation();
        partialUpdatedTeamAllocation.setId(teamAllocation.getId());

        partialUpdatedTeamAllocation.start(UPDATED_START).end(UPDATED_END);

        restTeamAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeamAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeamAllocation))
            )
            .andExpect(status().isOk());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
        TeamAllocation testTeamAllocation = teamAllocationList.get(teamAllocationList.size() - 1);
        assertThat(testTeamAllocation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeamAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testTeamAllocation.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateTeamAllocationWithPatch() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();

        // Update the teamAllocation using partial update
        TeamAllocation partialUpdatedTeamAllocation = new TeamAllocation();
        partialUpdatedTeamAllocation.setId(teamAllocation.getId());

        partialUpdatedTeamAllocation.start(UPDATED_START).end(UPDATED_END).note(UPDATED_NOTE);

        restTeamAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeamAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeamAllocation))
            )
            .andExpect(status().isOk());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
        TeamAllocation testTeamAllocation = teamAllocationList.get(teamAllocationList.size() - 1);
        assertThat(testTeamAllocation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeamAllocation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testTeamAllocation.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teamAllocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeamAllocation() throws Exception {
        int databaseSizeBeforeUpdate = teamAllocationRepository.findAll().size();
        teamAllocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamAllocationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(teamAllocation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeamAllocation in the database
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeamAllocation() throws Exception {
        // Initialize the database
        teamAllocationRepository.saveAndFlush(teamAllocation);

        int databaseSizeBeforeDelete = teamAllocationRepository.findAll().size();

        // Delete the teamAllocation
        restTeamAllocationMockMvc
            .perform(delete(ENTITY_API_URL_ID, teamAllocation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TeamAllocation> teamAllocationList = teamAllocationRepository.findAll();
        assertThat(teamAllocationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
