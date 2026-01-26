import { Page } from '@playwright/test';
import { DecisionTypeJourney } from '../../../types';
import { AboutAppealPage, DecisionTypePage, PayNowPage, EqualityAndDiversityStartPage } from '../../../page-objects/cui/pages/index';

export class DecisionTypeSectionOfAppealJourney {
  constructor(private readonly page: Page) {}
  private cui_aboutAppealPage = new AboutAppealPage(this.page);
  private cui_decisionTypePage = new DecisionTypePage(this.page);
  private cui_payNowPage = new PayNowPage(this.page);
  private cui_equalityAndDiversityStartPage = new EqualityAndDiversityStartPage(this.page);

  public async complete(appealData: DecisionTypeJourney): Promise<void> {
    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.decisionWithOrWithoutHearingLink);

    await this.cui_decisionTypePage.verifyUserIsOnDecisionTypePage();
    await this.cui_decisionTypePage.completePageAndContinue({ decisionWithOrWithoutHearing: appealData.decisionWithOrWithoutHearing });

    if (appealData.appealType === 'Protection') {
      if (!appealData.payForAppealNowOrLater) {
        throw new Error('appealData.payForAppealNowOrLater must be provided for appeal type Protection');
      }
      await this.cui_payNowPage.verifyUserIsOnPayNowPage();
      await this.cui_payNowPage.completePageAndContinue({ payNowOrLater: appealData.payForAppealNowOrLater });
    }

    await this.cui_equalityAndDiversityStartPage.verifyUserIsOnEqualityAndDiversityStartPage();
    await this.cui_equalityAndDiversityStartPage.completePageAndContinue();

    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
  }
}
