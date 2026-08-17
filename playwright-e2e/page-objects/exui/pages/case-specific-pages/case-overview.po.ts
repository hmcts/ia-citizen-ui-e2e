import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { config } from '../../../../utils';

type DropdownEventTypes =
  | 'Record remission decision'
  | 'Request respondent evidence'
  | 'Upload Home Office bundle'
  | 'AiP - Request Appeal Reasons'
  | 'Request respondent review'
  | 'Upload the appeal response'
  | 'Review Home Office response'
  | 'Request hearing requirements'
  | 'Review hearing requirements'
  | 'List the case'
  | 'Create case summary'
  | 'Generate hearing bundle'
  | 'Start decision and reasons'
  | 'Prepare Decision and Reasons'
  | 'Complete decision and reasons'
  | 'Decide FTPA application'
  | 'Generate Upper Tribunal bundle'
  | 'Request Home Office data'
  | 'Submit your appeal'
  | 'Create a service request'
  | 'Complete case review';

type CaseOverviewTabsType =
  | 'Tasks'
  | 'Roles and access'
  | 'Overview'
  | 'Appeal'
  | 'Appellant'
  | 'Documents'
  | 'Directions'
  | 'Case flags'
  | 'Hearing and appointment'
  | 'Case notes'
  | 'Applications'
  | 'Linked Cases'
  | 'Payment history'
  | 'Case history'
  | 'Hearings'
  | 'Validation'
  | 'Service Request';

export class CaseOverviewPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    nextStepsDropdown: this.page.locator('select[id="next-step"]'),
    goButton: this.page.getByRole('button', { name: 'Go', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly doThisNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'Do this next', exact: true })
    .filter({ visible: true });
  private readonly whatHappensNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'What happens next', exact: true })
    .filter({ visible: true });
  private readonly whatToDoNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'What to do next', exact: true })
    .filter({ visible: true });

  public readonly $static = {
    pageHeading: this.page
      .getByRole('heading', { level: 2, name: 'Current progress of the case', exact: true })
      .first()
      .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
    doThisNextHeading: this.doThisNextHeadingLocator,
    doThisNextParagraph: this.doThisNextHeadingLocator.locator('~ p'),
    doThisNextHeadingsLevel2: this.doThisNextHeadingLocator.locator('~ h2'),
    doThisNextBulletPoint: this.page.locator('markdown', { hasText: 'Do this next' }).filter({ visible: true }).locator('li'),
    whatHappensNextHeading: this.whatHappensNextHeadingLocator,
    whatHappensNextParagraph: this.whatHappensNextHeadingLocator.locator('~ p'),
    whatToDoNextHeading: this.whatToDoNextHeadingLocator,
    whatToDoNextParagraph: this.whatToDoNextHeadingLocator.locator('~ p'),
    alertMessage: this.page.locator('div[class="alert-message"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(options: { timeoutMs?: number }): Promise<void> {
    options.timeoutMs = options.timeoutMs ?? 30_000;
    await this.verifyUserIsOnExpectedPage({ urlPath: '#Overview', pageHeading: this.$static.pageHeading, timeout: options.timeoutMs });
  }

  public async goTo(options: { caseId: string; timeoutInMs?: number }): Promise<void> {
    const timeout = options.timeoutInMs ? options.timeoutInMs : 30_000;
    await this.page.goto(`${config.urls.exuiDefaultUrl}cases/case-details/IA/Asylum/${options.caseId}#Overview`);
    await this.verifyUserIsOnPage({ timeoutMs: timeout });
  }

  public async selectEventFromDropdown(options: { eventToSelect: DropdownEventTypes }): Promise<void> {
    await this.$interactive.nextStepsDropdown.selectOption({ label: options.eventToSelect });
    const selectedOption = await this.$interactive.nextStepsDropdown.locator('option:checked').textContent();
    expect(selectedOption?.trim()).toBe(options.eventToSelect);

    await this.navigationClick(this.$interactive.goButton);
  }

  public async navigateToTab(options: { tabToSelect: CaseOverviewTabsType }): Promise<void> {
    const tabLocator = this.page.getByRole('tab', { name: options.tabToSelect, exact: true });
    await expect(tabLocator).toBeVisible();
    await tabLocator.scrollIntoViewIfNeeded();
    await tabLocator.click();
    await expect(tabLocator).toHaveAttribute('aria-selected', 'true');
  }

  public async verifyAlertMessageAfterSubmittingEvent(options: { eventSubmitted: DropdownEventTypes }): Promise<void> {
    await expect(this.$static.alertMessage).toHaveText(new RegExp(`^\\s*Case #.+ has been updated with event: ${options.eventSubmitted}\\s*$`));
    await expect(this.$static.alertMessage).toBeVisible();
  }

  public async refreshPageUntilExpectedTextIsVisible(options: { expectedText: string; caseId: string; timeoutInSeconds?: number }): Promise<void> {
    const timeout = options.timeoutInSeconds ? options.timeoutInSeconds * 1000 : 45_000;

    await expect(async () => {
      if (!this.page.url().includes('#Overview')) {
        await this.goTo({ caseId: options.caseId, timeoutInMs: 15_000 });
      } else {
        await this.page.reload();
        await this.verifyUserIsOnPage({ timeoutMs: 15_000 });
      }

      const locator = this.page.getByText(options.expectedText);
      const count = await locator.count();

      let isAnyVisible = false;

      for (let i = 0; i < count; i++) {
        if (await locator.nth(i).isVisible()) {
          isAnyVisible = true;
          break;
        }
      }

      expect(isAnyVisible).toBeTruthy();
    }).toPass({
      timeout,
      intervals: [1_000],
    });
  }
}
