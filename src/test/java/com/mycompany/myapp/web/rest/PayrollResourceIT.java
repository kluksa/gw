package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Payroll;
import com.mycompany.myapp.repository.PayrollRepository;
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

/**
 * Integration tests for the {@link PayrollResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PayrollResourceIT {

    private static final LocalDate DEFAULT_EFFECTIVE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EFFECTIVE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_AMOUNT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT_TOTAL = new BigDecimal(2);

    private static final BigDecimal DEFAULT_AMOUNT_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT_NET = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/payrolls";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPayrollMockMvc;

    private Payroll payroll;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Payroll createEntity(EntityManager em) {
        Payroll payroll = new Payroll()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .amountTotal(DEFAULT_AMOUNT_TOTAL)
            .amountNet(DEFAULT_AMOUNT_NET);
        return payroll;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Payroll createUpdatedEntity(EntityManager em) {
        Payroll payroll = new Payroll()
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .amountTotal(UPDATED_AMOUNT_TOTAL)
            .amountNet(UPDATED_AMOUNT_NET);
        return payroll;
    }

    @BeforeEach
    public void initTest() {
        payroll = createEntity(em);
    }

    @Test
    @Transactional
    void createPayroll() throws Exception {
        int databaseSizeBeforeCreate = payrollRepository.findAll().size();
        // Create the Payroll
        restPayrollMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(payroll)))
            .andExpect(status().isCreated());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeCreate + 1);
        Payroll testPayroll = payrollList.get(payrollList.size() - 1);
        assertThat(testPayroll.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testPayroll.getAmountTotal()).isEqualByComparingTo(DEFAULT_AMOUNT_TOTAL);
        assertThat(testPayroll.getAmountNet()).isEqualByComparingTo(DEFAULT_AMOUNT_NET);
    }

    @Test
    @Transactional
    void createPayrollWithExistingId() throws Exception {
        // Create the Payroll with an existing ID
        payroll.setId(1L);

        int databaseSizeBeforeCreate = payrollRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPayrollMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(payroll)))
            .andExpect(status().isBadRequest());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPayrolls() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        // Get all the payrollList
        restPayrollMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(payroll.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(DEFAULT_EFFECTIVE_DATE.toString())))
            .andExpect(jsonPath("$.[*].amountTotal").value(hasItem(sameNumber(DEFAULT_AMOUNT_TOTAL))))
            .andExpect(jsonPath("$.[*].amountNet").value(hasItem(sameNumber(DEFAULT_AMOUNT_NET))));
    }

    @Test
    @Transactional
    void getPayroll() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        // Get the payroll
        restPayrollMockMvc
            .perform(get(ENTITY_API_URL_ID, payroll.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(payroll.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(DEFAULT_EFFECTIVE_DATE.toString()))
            .andExpect(jsonPath("$.amountTotal").value(sameNumber(DEFAULT_AMOUNT_TOTAL)))
            .andExpect(jsonPath("$.amountNet").value(sameNumber(DEFAULT_AMOUNT_NET)));
    }

    @Test
    @Transactional
    void getNonExistingPayroll() throws Exception {
        // Get the payroll
        restPayrollMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPayroll() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();

        // Update the payroll
        Payroll updatedPayroll = payrollRepository.findById(payroll.getId()).get();
        // Disconnect from session so that the updates on updatedPayroll are not directly saved in db
        em.detach(updatedPayroll);
        updatedPayroll.effectiveDate(UPDATED_EFFECTIVE_DATE).amountTotal(UPDATED_AMOUNT_TOTAL).amountNet(UPDATED_AMOUNT_NET);

        restPayrollMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPayroll.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPayroll))
            )
            .andExpect(status().isOk());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
        Payroll testPayroll = payrollList.get(payrollList.size() - 1);
        assertThat(testPayroll.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testPayroll.getAmountTotal()).isEqualTo(UPDATED_AMOUNT_TOTAL);
        assertThat(testPayroll.getAmountNet()).isEqualTo(UPDATED_AMOUNT_NET);
    }

    @Test
    @Transactional
    void putNonExistingPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(
                put(ENTITY_API_URL_ID, payroll.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(payroll))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(payroll))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(payroll)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePayrollWithPatch() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();

        // Update the payroll using partial update
        Payroll partialUpdatedPayroll = new Payroll();
        partialUpdatedPayroll.setId(payroll.getId());

        partialUpdatedPayroll.amountTotal(UPDATED_AMOUNT_TOTAL).amountNet(UPDATED_AMOUNT_NET);

        restPayrollMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayroll.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPayroll))
            )
            .andExpect(status().isOk());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
        Payroll testPayroll = payrollList.get(payrollList.size() - 1);
        assertThat(testPayroll.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testPayroll.getAmountTotal()).isEqualByComparingTo(UPDATED_AMOUNT_TOTAL);
        assertThat(testPayroll.getAmountNet()).isEqualByComparingTo(UPDATED_AMOUNT_NET);
    }

    @Test
    @Transactional
    void fullUpdatePayrollWithPatch() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();

        // Update the payroll using partial update
        Payroll partialUpdatedPayroll = new Payroll();
        partialUpdatedPayroll.setId(payroll.getId());

        partialUpdatedPayroll.effectiveDate(UPDATED_EFFECTIVE_DATE).amountTotal(UPDATED_AMOUNT_TOTAL).amountNet(UPDATED_AMOUNT_NET);

        restPayrollMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayroll.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPayroll))
            )
            .andExpect(status().isOk());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
        Payroll testPayroll = payrollList.get(payrollList.size() - 1);
        assertThat(testPayroll.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testPayroll.getAmountTotal()).isEqualByComparingTo(UPDATED_AMOUNT_TOTAL);
        assertThat(testPayroll.getAmountNet()).isEqualByComparingTo(UPDATED_AMOUNT_NET);
    }

    @Test
    @Transactional
    void patchNonExistingPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, payroll.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(payroll))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(payroll))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPayroll() throws Exception {
        int databaseSizeBeforeUpdate = payrollRepository.findAll().size();
        payroll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayrollMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(payroll)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Payroll in the database
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePayroll() throws Exception {
        // Initialize the database
        payrollRepository.saveAndFlush(payroll);

        int databaseSizeBeforeDelete = payrollRepository.findAll().size();

        // Delete the payroll
        restPayrollMockMvc
            .perform(delete(ENTITY_API_URL_ID, payroll.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Payroll> payrollList = payrollRepository.findAll();
        assertThat(payrollList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
