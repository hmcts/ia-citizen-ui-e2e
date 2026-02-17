import { APIRequestContext, expect, Page } from '@playwright/test';
import { postForm } from '../../../../utils/citizen-user.utils';
import { DataUtils } from '../../../../utils';

export class PaymentApi {
  private apiContext: APIRequestContext;
  private dataUtils: DataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    await expect(async () => {
      const triggerResponse = await this.apiContext.get('pay-immediately', {
        maxRedirects: 0,
      });

      const secureUrl = triggerResponse.headers()['location'];
      if (!secureUrl) throw new Error('Redirect URL to GOV.UK Pay not found');

      const paymentPageResponse = await this.apiContext.get(secureUrl);
      await expect(paymentPageResponse).toBeOK();

      const paymentPageHtml = await paymentPageResponse.text();
      const paymentUrl = paymentPageResponse.url();

      const paymentId = paymentUrl.replace(/\/$/, '').split('/').pop();
      const submissionBaseUrl = `https://card.payments.service.gov.uk/card_details/${paymentId}`;

      const paymentPageCsrf = paymentPageHtml.match(/name="csrfToken".*?value="([^"]+)"/)?.[1];
      if (!paymentPageCsrf) {
        throw new Error('Could not extract initial csrfToken from GOV.UK Pay page');
      }

      const paymentDetails = await this.dataUtils.generatePaymentDetails();
      const submitDetailsResponse = await this.apiContext.post(submissionBaseUrl, {
        form: {
          chargeId: paymentId!,
          csrfToken: paymentPageCsrf,
          cardNo: paymentDetails.cardNumber,
          expiryMonth: paymentDetails.expiryMonth,
          expiryYear: paymentDetails.expiryYear,
          cardholderName: paymentDetails.nameOnCard,
          cvc: paymentDetails.securityCode,
          addressLine1: paymentDetails.addressLine1,
          addressCity: paymentDetails.townOrCity,
          addressCountry: 'GB',
          addressPostcode: paymentDetails.postcode,
          email: paymentDetails.email,
        },
      });

      await expect(submitDetailsResponse).toBeOK();
      const confirmPaymentHtml = await submitDetailsResponse.text();

      const confirmPaymentCsrf = confirmPaymentHtml.match(/name="csrfToken".*?value="([^"]+)"/)?.[1];
      if (!confirmPaymentCsrf) throw new Error('Could not extract confirmation csrfToken');

      await postForm({
        apiContext: this.apiContext,
        path: `${submissionBaseUrl}/confirm`,
        form: {
          csrfToken: confirmPaymentCsrf,
          chargeId: paymentId!,
        },
      });
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }
}
