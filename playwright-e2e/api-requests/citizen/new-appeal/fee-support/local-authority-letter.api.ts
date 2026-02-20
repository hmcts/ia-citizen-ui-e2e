import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm, cui_uploadDocument } from '../../../../utils/api-requests-utils';

export class LocalAuthorityLetterApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'local-authority-letter',
    });

    const fileName = options.nameOfFileToUpload ?? 'Local_Authority_Letter.txt';

    await cui_uploadDocument({
      apiContext: this.apiContext,
      path: `local-authority-letter/upload?_csrf=${csrfToken}`,
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      fileUploadFieldName: 'file-upload',
      nameOfFileToUpload: fileName,
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'local-authority-letter',
      form: {
        _csrf: csrfToken,
        'file-upload': '',
        saveAndContinue: '',
      },
    });
  }
}
