import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ProjectAllocationComponentsPage,
  ProjectAllocationDeleteDialog,
  ProjectAllocationUpdatePage,
} from './project-allocation.page-object';

const expect = chai.expect;

describe('ProjectAllocation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let projectAllocationComponentsPage: ProjectAllocationComponentsPage;
  let projectAllocationUpdatePage: ProjectAllocationUpdatePage;
  let projectAllocationDeleteDialog: ProjectAllocationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProjectAllocations', async () => {
    await navBarPage.goToEntity('project-allocation');
    projectAllocationComponentsPage = new ProjectAllocationComponentsPage();
    await browser.wait(ec.visibilityOf(projectAllocationComponentsPage.title), 5000);
    expect(await projectAllocationComponentsPage.getTitle()).to.eq('gwApp.projectAllocation.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(projectAllocationComponentsPage.entities), ec.visibilityOf(projectAllocationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProjectAllocation page', async () => {
    await projectAllocationComponentsPage.clickOnCreateButton();
    projectAllocationUpdatePage = new ProjectAllocationUpdatePage();
    expect(await projectAllocationUpdatePage.getPageTitle()).to.eq('gwApp.projectAllocation.home.createOrEditLabel');
    await projectAllocationUpdatePage.cancel();
  });

  it('should create and save ProjectAllocations', async () => {
    const nbButtonsBeforeCreate = await projectAllocationComponentsPage.countDeleteButtons();

    await projectAllocationComponentsPage.clickOnCreateButton();

    await promise.all([
      projectAllocationUpdatePage.setStartInput('2000-12-31'),
      projectAllocationUpdatePage.setEndInput('2000-12-31'),
      projectAllocationUpdatePage.setNoteInput('note'),
      projectAllocationUpdatePage.projectSelectLastOption(),
      projectAllocationUpdatePage.memberSelectLastOption(),
    ]);

    await projectAllocationUpdatePage.save();
    expect(await projectAllocationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await projectAllocationComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ProjectAllocation', async () => {
    const nbButtonsBeforeDelete = await projectAllocationComponentsPage.countDeleteButtons();
    await projectAllocationComponentsPage.clickOnLastDeleteButton();

    projectAllocationDeleteDialog = new ProjectAllocationDeleteDialog();
    expect(await projectAllocationDeleteDialog.getDialogTitle()).to.eq('gwApp.projectAllocation.delete.question');
    await projectAllocationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(projectAllocationComponentsPage.title), 5000);

    expect(await projectAllocationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
