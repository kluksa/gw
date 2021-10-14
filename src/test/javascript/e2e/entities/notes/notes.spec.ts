import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { NotesComponentsPage, NotesDeleteDialog, NotesUpdatePage } from './notes.page-object';

const expect = chai.expect;

describe('Notes e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let notesComponentsPage: NotesComponentsPage;
  let notesUpdatePage: NotesUpdatePage;
  let notesDeleteDialog: NotesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Notes', async () => {
    await navBarPage.goToEntity('notes');
    notesComponentsPage = new NotesComponentsPage();
    await browser.wait(ec.visibilityOf(notesComponentsPage.title), 5000);
    expect(await notesComponentsPage.getTitle()).to.eq('gwApp.notes.home.title');
    await browser.wait(ec.or(ec.visibilityOf(notesComponentsPage.entities), ec.visibilityOf(notesComponentsPage.noResult)), 1000);
  });

  it('should load create Notes page', async () => {
    await notesComponentsPage.clickOnCreateButton();
    notesUpdatePage = new NotesUpdatePage();
    expect(await notesUpdatePage.getPageTitle()).to.eq('gwApp.notes.home.createOrEditLabel');
    await notesUpdatePage.cancel();
  });

  it('should create and save Notes', async () => {
    const nbButtonsBeforeCreate = await notesComponentsPage.countDeleteButtons();

    await notesComponentsPage.clickOnCreateButton();

    await promise.all([
      notesUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      notesUpdatePage.setNoteInput('note'),
      notesUpdatePage.employeeSelectLastOption(),
    ]);

    await notesUpdatePage.save();
    expect(await notesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await notesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Notes', async () => {
    const nbButtonsBeforeDelete = await notesComponentsPage.countDeleteButtons();
    await notesComponentsPage.clickOnLastDeleteButton();

    notesDeleteDialog = new NotesDeleteDialog();
    expect(await notesDeleteDialog.getDialogTitle()).to.eq('gwApp.notes.delete.question');
    await notesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(notesComponentsPage.title), 5000);

    expect(await notesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
