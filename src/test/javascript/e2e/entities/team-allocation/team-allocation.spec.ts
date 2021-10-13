import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TeamAllocationComponentsPage, TeamAllocationDeleteDialog, TeamAllocationUpdatePage } from './team-allocation.page-object';

const expect = chai.expect;

describe('TeamAllocation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let teamAllocationComponentsPage: TeamAllocationComponentsPage;
  let teamAllocationUpdatePage: TeamAllocationUpdatePage;
  let teamAllocationDeleteDialog: TeamAllocationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TeamAllocations', async () => {
    await navBarPage.goToEntity('team-allocation');
    teamAllocationComponentsPage = new TeamAllocationComponentsPage();
    await browser.wait(ec.visibilityOf(teamAllocationComponentsPage.title), 5000);
    expect(await teamAllocationComponentsPage.getTitle()).to.eq('gwApp.teamAllocation.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(teamAllocationComponentsPage.entities), ec.visibilityOf(teamAllocationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TeamAllocation page', async () => {
    await teamAllocationComponentsPage.clickOnCreateButton();
    teamAllocationUpdatePage = new TeamAllocationUpdatePage();
    expect(await teamAllocationUpdatePage.getPageTitle()).to.eq('gwApp.teamAllocation.home.createOrEditLabel');
    await teamAllocationUpdatePage.cancel();
  });

  it('should create and save TeamAllocations', async () => {
    const nbButtonsBeforeCreate = await teamAllocationComponentsPage.countDeleteButtons();

    await teamAllocationComponentsPage.clickOnCreateButton();

    await promise.all([
      teamAllocationUpdatePage.setStartInput('2000-12-31'),
      teamAllocationUpdatePage.setEndInput('2000-12-31'),
      teamAllocationUpdatePage.setNoteInput('note'),
      teamAllocationUpdatePage.memberSelectLastOption(),
      teamAllocationUpdatePage.teamSelectLastOption(),
    ]);

    await teamAllocationUpdatePage.save();
    expect(await teamAllocationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await teamAllocationComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last TeamAllocation', async () => {
    const nbButtonsBeforeDelete = await teamAllocationComponentsPage.countDeleteButtons();
    await teamAllocationComponentsPage.clickOnLastDeleteButton();

    teamAllocationDeleteDialog = new TeamAllocationDeleteDialog();
    expect(await teamAllocationDeleteDialog.getDialogTitle()).to.eq('gwApp.teamAllocation.delete.question');
    await teamAllocationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(teamAllocationComponentsPage.title), 5000);

    expect(await teamAllocationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
