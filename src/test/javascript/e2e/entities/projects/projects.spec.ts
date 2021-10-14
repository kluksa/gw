import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProjectsComponentsPage, ProjectsDeleteDialog, ProjectsUpdatePage } from './projects.page-object';

const expect = chai.expect;

describe('Projects e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let projectsComponentsPage: ProjectsComponentsPage;
  let projectsUpdatePage: ProjectsUpdatePage;
  let projectsDeleteDialog: ProjectsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Projects', async () => {
    await navBarPage.goToEntity('projects');
    projectsComponentsPage = new ProjectsComponentsPage();
    await browser.wait(ec.visibilityOf(projectsComponentsPage.title), 5000);
    expect(await projectsComponentsPage.getTitle()).to.eq('gwApp.projects.home.title');
    await browser.wait(ec.or(ec.visibilityOf(projectsComponentsPage.entities), ec.visibilityOf(projectsComponentsPage.noResult)), 1000);
  });

  it('should load create Projects page', async () => {
    await projectsComponentsPage.clickOnCreateButton();
    projectsUpdatePage = new ProjectsUpdatePage();
    expect(await projectsUpdatePage.getPageTitle()).to.eq('gwApp.projects.home.createOrEditLabel');
    await projectsUpdatePage.cancel();
  });

  it('should create and save Projects', async () => {
    const nbButtonsBeforeCreate = await projectsComponentsPage.countDeleteButtons();

    await projectsComponentsPage.clickOnCreateButton();

    await promise.all([
      projectsUpdatePage.setStartInput('2000-12-31'),
      projectsUpdatePage.setEndInput('2000-12-31'),
      projectsUpdatePage.setNameInput('name'),
      projectsUpdatePage.setNoteInput('note'),
      projectsUpdatePage.managerSelectLastOption(),
    ]);

    await projectsUpdatePage.save();
    expect(await projectsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await projectsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Projects', async () => {
    const nbButtonsBeforeDelete = await projectsComponentsPage.countDeleteButtons();
    await projectsComponentsPage.clickOnLastDeleteButton();

    projectsDeleteDialog = new ProjectsDeleteDialog();
    expect(await projectsDeleteDialog.getDialogTitle()).to.eq('gwApp.projects.delete.question');
    await projectsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(projectsComponentsPage.title), 5000);

    expect(await projectsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
