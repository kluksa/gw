import { element, by, ElementFinder } from 'protractor';

export class ProjectAllocationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-project-allocation div table .btn-danger'));
  title = element.all(by.css('jhi-project-allocation div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ProjectAllocationUpdatePage {
  pageTitle = element(by.id('jhi-project-allocation-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  startInput = element(by.id('field_start'));
  endInput = element(by.id('field_end'));
  noteInput = element(by.id('field_note'));

  projectSelect = element(by.id('field_project'));
  memberSelect = element(by.id('field_member'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setStartInput(start: string): Promise<void> {
    await this.startInput.sendKeys(start);
  }

  async getStartInput(): Promise<string> {
    return await this.startInput.getAttribute('value');
  }

  async setEndInput(end: string): Promise<void> {
    await this.endInput.sendKeys(end);
  }

  async getEndInput(): Promise<string> {
    return await this.endInput.getAttribute('value');
  }

  async setNoteInput(note: string): Promise<void> {
    await this.noteInput.sendKeys(note);
  }

  async getNoteInput(): Promise<string> {
    return await this.noteInput.getAttribute('value');
  }

  async projectSelectLastOption(): Promise<void> {
    await this.projectSelect.all(by.tagName('option')).last().click();
  }

  async projectSelectOption(option: string): Promise<void> {
    await this.projectSelect.sendKeys(option);
  }

  getProjectSelect(): ElementFinder {
    return this.projectSelect;
  }

  async getProjectSelectedOption(): Promise<string> {
    return await this.projectSelect.element(by.css('option:checked')).getText();
  }

  async memberSelectLastOption(): Promise<void> {
    await this.memberSelect.all(by.tagName('option')).last().click();
  }

  async memberSelectOption(option: string): Promise<void> {
    await this.memberSelect.sendKeys(option);
  }

  getMemberSelect(): ElementFinder {
    return this.memberSelect;
  }

  async getMemberSelectedOption(): Promise<string> {
    return await this.memberSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ProjectAllocationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-projectAllocation-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-projectAllocation'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
