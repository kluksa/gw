import { element, by, ElementFinder } from 'protractor';

export class PayrollComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-payroll div table .btn-danger'));
  title = element.all(by.css('jhi-payroll div h2#page-heading span')).first();
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

export class PayrollUpdatePage {
  pageTitle = element(by.id('jhi-payroll-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  effectiveDateInput = element(by.id('field_effectiveDate'));
  amountTotalInput = element(by.id('field_amountTotal'));
  amountNetInput = element(by.id('field_amountNet'));

  employeeSelect = element(by.id('field_employee'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setEffectiveDateInput(effectiveDate: string): Promise<void> {
    await this.effectiveDateInput.sendKeys(effectiveDate);
  }

  async getEffectiveDateInput(): Promise<string> {
    return await this.effectiveDateInput.getAttribute('value');
  }

  async setAmountTotalInput(amountTotal: string): Promise<void> {
    await this.amountTotalInput.sendKeys(amountTotal);
  }

  async getAmountTotalInput(): Promise<string> {
    return await this.amountTotalInput.getAttribute('value');
  }

  async setAmountNetInput(amountNet: string): Promise<void> {
    await this.amountNetInput.sendKeys(amountNet);
  }

  async getAmountNetInput(): Promise<string> {
    return await this.amountNetInput.getAttribute('value');
  }

  async employeeSelectLastOption(): Promise<void> {
    await this.employeeSelect.all(by.tagName('option')).last().click();
  }

  async employeeSelectOption(option: string): Promise<void> {
    await this.employeeSelect.sendKeys(option);
  }

  getEmployeeSelect(): ElementFinder {
    return this.employeeSelect;
  }

  async getEmployeeSelectedOption(): Promise<string> {
    return await this.employeeSelect.element(by.css('option:checked')).getText();
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

export class PayrollDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-payroll-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-payroll'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
