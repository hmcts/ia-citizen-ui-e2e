import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

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
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'contact-preferences' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    switch (options.contactPreference) {
      case 'Email':
        if (!options.applicantEmail) {
          throw new Error('applicantEmail is required when contactPreference is Email');
        }

        form.selections = 'email';
        form['email-value'] = options.applicantEmail;
        break;
      case 'Phone':
        if (!options.applicantPhoneNumber) {
          throw new Error('applicationPhoneNumber is required when contactPreference is Phone');
        }

        form.selections = 'text-message';
        form['text-message-value'] = options.applicantPhoneNumber;
        break;
      case 'Email and Phone':
        if (!options.applicantEmail || !options.applicantPhoneNumber) {
          throw new Error('Both applicantEmail and applicationPhoneNumber are required when contactPreference is Email and Phone');
        }

        (form as any).selections = ['email', 'text-message'];
        form['email-value'] = options.applicantEmail;
        form['text-message-value'] = options.applicantPhoneNumber;
        break;
      default:
        throw new Error(`Invalid contact preference: ${options.contactPreference}`);
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'contact-preferences',
      form,
    });
  }
}
