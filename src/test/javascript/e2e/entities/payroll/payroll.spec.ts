import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PayrollComponentsPage, PayrollDeleteDialog, PayrollUpdatePage } from './payroll.page-object';

const expect = chai.expect;

describe('Payroll e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let payrollComponentsPage: PayrollComponentsPage;
  let payrollUpdatePage: PayrollUpdatePage;
  let payrollDeleteDialog: PayrollDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Payrolls', async () => {
    await navBarPage.goToEntity('payroll');
    payrollComponentsPage = new PayrollComponentsPage();
    await browser.wait(ec.visibilityOf(payrollComponentsPage.title), 5000);
    expect(await payrollComponentsPage.getTitle()).to.eq('gwApp.payroll.home.title');
    await browser.wait(ec.or(ec.visibilityOf(payrollComponentsPage.entities), ec.visibilityOf(payrollComponentsPage.noResult)), 1000);
  });

  it('should load create Payroll page', async () => {
    await payrollComponentsPage.clickOnCreateButton();
    payrollUpdatePage = new PayrollUpdatePage();
    expect(await payrollUpdatePage.getPageTitle()).to.eq('gwApp.payroll.home.createOrEditLabel');
    await payrollUpdatePage.cancel();
  });

  it('should create and save Payrolls', async () => {
    const nbButtonsBeforeCreate = await payrollComponentsPage.countDeleteButtons();

    await payrollComponentsPage.clickOnCreateButton();

    await promise.all([
      payrollUpdatePage.setEffectiveDateInput('2000-12-31'),
      payrollUpdatePage.setAmountTotalInput('5'),
      payrollUpdatePage.setAmountNetInput('5'),
      payrollUpdatePage.employeeSelectLastOption(),
    ]);

    await payrollUpdatePage.save();
    expect(await payrollUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await payrollComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Payroll', async () => {
    const nbButtonsBeforeDelete = await payrollComponentsPage.countDeleteButtons();
    await payrollComponentsPage.clickOnLastDeleteButton();

    payrollDeleteDialog = new PayrollDeleteDialog();
    expect(await payrollDeleteDialog.getDialogTitle()).to.eq('gwApp.payroll.delete.question');
    await payrollDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(payrollComponentsPage.title), 5000);

    expect(await payrollComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
