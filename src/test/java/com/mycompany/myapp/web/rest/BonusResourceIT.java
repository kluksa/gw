package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Bonus;
import com.mycompany.myapp.repository.BonusRepository;
import java.math.BigDecimal;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link BonusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BonusResourceIT {

    private static final LocalDate DEFAULT_EFFECTIVE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EFFECTIVE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bonuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BonusRepository bonusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBonusMockMvc;

    private Bonus bonus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bonus createEntity(EntityManager em) {
        Bonus bonus = new Bonus().effectiveDate(DEFAULT_EFFECTIVE_DATE).amount(DEFAULT_AMOUNT).note(DEFAULT_NOTE);
        return bonus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bonus createUpdatedEntity(EntityManager em) {
        Bonus bonus = new Bonus().effectiveDate(UPDATED_EFFECTIVE_DATE).amount(UPDATED_AMOUNT).note(UPDATED_NOTE);
        return bonus;
    }

    @BeforeEach
    public void initTest() {
        bonus = createEntity(em);
    }

    @Test
    @Transactional
    void createBonus() throws Exception {
        int databaseSizeBeforeCreate = bonusRepository.findAll().size();
        // Create the Bonus
        restBonusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bonus)))
            .andExpect(status().isCreated());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeCreate + 1);
        Bonus testBonus = bonusList.get(bonusList.size() - 1);
        assertThat(testBonus.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testBonus.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
        assertThat(testBonus.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createBonusWithExistingId() throws Exception {
        // Create the Bonus with an existing ID
        bonus.setId(1L);

        int databaseSizeBeforeCreate = bonusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBonusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bonus)))
            .andExpect(status().isBadRequest());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBonuses() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        // Get all the bonusList
        restBonusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bonus.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(DEFAULT_EFFECTIVE_DATE.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())));
    }

    @Test
    @Transactional
    void getBonus() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        // Get the bonus
        restBonusMockMvc
            .perform(get(ENTITY_API_URL_ID, bonus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bonus.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(DEFAULT_EFFECTIVE_DATE.toString()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBonus() throws Exception {
        // Get the bonus
        restBonusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBonus() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();

        // Update the bonus
        Bonus updatedBonus = bonusRepository.findById(bonus.getId()).get();
        // Disconnect from session so that the updates on updatedBonus are not directly saved in db
        em.detach(updatedBonus);
        updatedBonus.effectiveDate(UPDATED_EFFECTIVE_DATE).amount(UPDATED_AMOUNT).note(UPDATED_NOTE);

        restBonusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBonus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBonus))
            )
            .andExpect(status().isOk());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
        Bonus testBonus = bonusList.get(bonusList.size() - 1);
        assertThat(testBonus.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testBonus.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testBonus.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bonus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bonus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bonus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bonus)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBonusWithPatch() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();

        // Update the bonus using partial update
        Bonus partialUpdatedBonus = new Bonus();
        partialUpdatedBonus.setId(bonus.getId());

        restBonusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBonus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBonus))
            )
            .andExpect(status().isOk());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
        Bonus testBonus = bonusList.get(bonusList.size() - 1);
        assertThat(testBonus.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testBonus.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
        assertThat(testBonus.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateBonusWithPatch() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();

        // Update the bonus using partial update
        Bonus partialUpdatedBonus = new Bonus();
        partialUpdatedBonus.setId(bonus.getId());

        partialUpdatedBonus.effectiveDate(UPDATED_EFFECTIVE_DATE).amount(UPDATED_AMOUNT).note(UPDATED_NOTE);

        restBonusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBonus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBonus))
            )
            .andExpect(status().isOk());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
        Bonus testBonus = bonusList.get(bonusList.size() - 1);
        assertThat(testBonus.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testBonus.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
        assertThat(testBonus.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bonus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bonus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bonus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBonus() throws Exception {
        int databaseSizeBeforeUpdate = bonusRepository.findAll().size();
        bonus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBonusMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bonus)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bonus in the database
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBonus() throws Exception {
        // Initialize the database
        bonusRepository.saveAndFlush(bonus);

        int databaseSizeBeforeDelete = bonusRepository.findAll().size();

        // Delete the bonus
        restBonusMockMvc
            .perform(delete(ENTITY_API_URL_ID, bonus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bonus> bonusList = bonusRepository.findAll();
        assertThat(bonusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
