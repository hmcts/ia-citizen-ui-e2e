import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

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
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-contact-preferences' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
      selections: '',
    };

    switch (options.contactPreference) {
      case 'Email':
        if (!options.sponsorEmail) {
          throw new Error('sponsorEmail is required when contactPreference is Email');
        }

        form.selections = 'email';
        form['email-value'] = options.sponsorEmail;
        break;
      case 'Phone':
        if (!options.sponsorPhoneNumber) {
          throw new Error('sponsorPhoneNumber is required when contactPreference is Phone');
        }

        form.selections = 'text-message';
        form['text-message-value'] = options.sponsorPhoneNumber;
        break;
      case 'Email and Phone':
        if (!options.sponsorEmail || !options.sponsorPhoneNumber) {
          throw new Error('Both sponsorEmail and sponsorPhoneNumber are required when contactPreference is Email and Phone');
        }

        (form as any).selections = ['email', 'text-message'];
        form['email-value'] = options.sponsorEmail;
        form['text-message-value'] = options.sponsorPhoneNumber;
        break;
      default:
        throw new Error(`Invalid contact preference: ${options.contactPreference}`);
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'sponsor-contact-preferences',
      form,
    });
  }
}
