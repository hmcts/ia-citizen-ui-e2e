import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class ContactPreferencesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: {
    contactPreference: 'Email' | 'Phone' | 'Email and Phone';
    applicantEmail?: string;
    applicantPhoneNumber?: string;
  }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'contact-preferences' });

    const form = new FormData();

    form.append('_csrf', csrfToken);
    form.append('saveAndContinue', '');

    switch (options.contactPreference) {
      case 'Email':
        if (!options.applicantEmail) {
          throw new Error('applicantEmail is required when contactPreference is Email');
        }

        form.append('selections', 'email');
        form.append('email-value', options.applicantEmail);
        break;

      case 'Phone':
        if (!options.applicantPhoneNumber) {
          throw new Error('applicationPhoneNumber is required when contactPreference is Phone');
        }

        form.append('selections', 'text-message');
        form.append('text-message-value', options.applicantPhoneNumber);
        break;

      case 'Email and Phone':
        if (!options.applicantEmail || !options.applicantPhoneNumber) {
          throw new Error('Both applicantEmail and applicationPhoneNumber are required when contactPreference is Email and Phone');
        }

        form.append('selections', 'email');
        form.append('selections', 'text-message');
        form.append('email-value', options.applicantEmail);
        form.append('text-message-value', options.applicantPhoneNumber);
        break;

      default:
        throw new Error(`Invalid contact preference: ${options.contactPreference}`);
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'contact-preferences',
      form,
    });
  }
}
