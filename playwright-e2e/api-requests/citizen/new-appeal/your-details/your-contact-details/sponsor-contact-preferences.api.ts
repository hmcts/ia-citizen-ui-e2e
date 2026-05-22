import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class SponsorContactPreferencesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: {
    contactPreference: 'Email' | 'Phone' | 'Email and Phone';
    sponsorEmail?: string;
    sponsorPhoneNumber?: string;
  }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-contact-preferences' });

    const form = new FormData();

    form.append('_csrf', csrfToken);
    form.append('saveAndContinue', '');

    switch (options.contactPreference) {
      case 'Email':
        if (!options.sponsorEmail) {
          throw new Error('sponsorEmail is required when contactPreference is Email');
        }

        form.append('selections', 'email');
        form.append('email-value', options.sponsorEmail);
        break;

      case 'Phone':
        if (!options.sponsorPhoneNumber) {
          throw new Error('sponsorPhoneNumber is required when contactPreference is Phone');
        }

        form.append('selections', 'text-message');
        form.append('text-message-value', options.sponsorPhoneNumber);
        break;

      case 'Email and Phone':
        if (!options.sponsorEmail || !options.sponsorPhoneNumber) {
          throw new Error('Both sponsorEmail and sponsorPhoneNumber are required when contactPreference is Email and Phone');
        }

        form.append('selections', 'email');
        form.append('selections', 'text-message');
        form.append('email-value', options.sponsorEmail);
        form.append('text-message-value', options.sponsorPhoneNumber);
        break;

      default:
        throw new Error(`Invalid contact preference: ${options.contactPreference}`);
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'sponsor-contact-preferences',
      form,
    });
  }
}
