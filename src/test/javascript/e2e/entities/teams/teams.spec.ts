import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TeamsComponentsPage, TeamsDeleteDialog, TeamsUpdatePage } from './teams.page-object';

const expect = chai.expect;

describe('Teams e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let teamsComponentsPage: TeamsComponentsPage;
  let teamsUpdatePage: TeamsUpdatePage;
  let teamsDeleteDialog: TeamsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Teams', async () => {
    await navBarPage.goToEntity('teams');
    teamsComponentsPage = new TeamsComponentsPage();
    await browser.wait(ec.visibilityOf(teamsComponentsPage.title), 5000);
    expect(await teamsComponentsPage.getTitle()).to.eq('gwApp.teams.home.title');
    await browser.wait(ec.or(ec.visibilityOf(teamsComponentsPage.entities), ec.visibilityOf(teamsComponentsPage.noResult)), 1000);
  });

  it('should load create Teams page', async () => {
    await teamsComponentsPage.clickOnCreateButton();
    teamsUpdatePage = new TeamsUpdatePage();
    expect(await teamsUpdatePage.getPageTitle()).to.eq('gwApp.teams.home.createOrEditLabel');
    await teamsUpdatePage.cancel();
  });

  it('should create and save Teams', async () => {
    const nbButtonsBeforeCreate = await teamsComponentsPage.countDeleteButtons();

    await teamsComponentsPage.clickOnCreateButton();

    await promise.all([
      teamsUpdatePage.setStartInput('2000-12-31'),
      teamsUpdatePage.setEndInput('2000-12-31'),
      teamsUpdatePage.leaderSelectLastOption(),
    ]);

    await teamsUpdatePage.save();
    expect(await teamsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await teamsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Teams', async () => {
    const nbButtonsBeforeDelete = await teamsComponentsPage.countDeleteButtons();
    await teamsComponentsPage.clickOnLastDeleteButton();

    teamsDeleteDialog = new TeamsDeleteDialog();
    expect(await teamsDeleteDialog.getDialogTitle()).to.eq('gwApp.teams.delete.question');
    await teamsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(teamsComponentsPage.title), 5000);

    expect(await teamsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
