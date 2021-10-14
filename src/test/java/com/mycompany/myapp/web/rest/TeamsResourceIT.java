package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Teams;
import com.mycompany.myapp.repository.TeamsRepository;
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
 * Integration tests for the {@link TeamsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TeamsResourceIT {

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/teams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TeamsRepository teamsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeamsMockMvc;

    private Teams teams;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teams createEntity(EntityManager em) {
        Teams teams = new Teams().start(DEFAULT_START).end(DEFAULT_END);
        return teams;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teams createUpdatedEntity(EntityManager em) {
        Teams teams = new Teams().start(UPDATED_START).end(UPDATED_END);
        return teams;
    }

    @BeforeEach
    public void initTest() {
        teams = createEntity(em);
    }

    @Test
    @Transactional
    void createTeams() throws Exception {
        int databaseSizeBeforeCreate = teamsRepository.findAll().size();
        // Create the Teams
        restTeamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isCreated());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeCreate + 1);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testTeams.getEnd()).isEqualTo(DEFAULT_END);
    }

    @Test
    @Transactional
    void createTeamsWithExistingId() throws Exception {
        // Create the Teams with an existing ID
        teams.setId(1L);

        int databaseSizeBeforeCreate = teamsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        // Get all the teamsList
        restTeamsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teams.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())));
    }

    @Test
    @Transactional
    void getTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        // Get the teams
        restTeamsMockMvc
            .perform(get(ENTITY_API_URL_ID, teams.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teams.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTeams() throws Exception {
        // Get the teams
        restTeamsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();

        // Update the teams
        Teams updatedTeams = teamsRepository.findById(teams.getId()).get();
        // Disconnect from session so that the updates on updatedTeams are not directly saved in db
        em.detach(updatedTeams);
        updatedTeams.start(UPDATED_START).end(UPDATED_END);

        restTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTeams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTeams))
            )
            .andExpect(status().isOk());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeams.getEnd()).isEqualTo(UPDATED_END);
    }

    @Test
    @Transactional
    void putNonExistingTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teams))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teams))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeamsWithPatch() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();

        // Update the teams using partial update
        Teams partialUpdatedTeams = new Teams();
        partialUpdatedTeams.setId(teams.getId());

        partialUpdatedTeams.start(UPDATED_START);

        restTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeams))
            )
            .andExpect(status().isOk());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeams.getEnd()).isEqualTo(DEFAULT_END);
    }

    @Test
    @Transactional
    void fullUpdateTeamsWithPatch() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();

        // Update the teams using partial update
        Teams partialUpdatedTeams = new Teams();
        partialUpdatedTeams.setId(teams.getId());

        partialUpdatedTeams.start(UPDATED_START).end(UPDATED_END);

        restTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeams))
            )
            .andExpect(status().isOk());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTeams.getEnd()).isEqualTo(UPDATED_END);
    }

    @Test
    @Transactional
    void patchNonExistingTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teams))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teams))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();
        teams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeDelete = teamsRepository.findAll().size();

        // Delete the teams
        restTeamsMockMvc
            .perform(delete(ENTITY_API_URL_ID, teams.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
