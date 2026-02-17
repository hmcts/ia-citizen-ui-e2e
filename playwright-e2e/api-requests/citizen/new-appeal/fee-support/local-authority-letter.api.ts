import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm, uploadDocument } from '../../../../utils/citizen-user.utils';

export class LocalAuthorityLetterApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'local-authority-letter',
    });

    const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';

    await uploadDocument({
      apiContext: this.apiContext,
      path: `local-authority-letter/upload?_csrf=${csrfToken}`,
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      fileUploadFieldName: 'file-upload',
      nameOfFileToUpload: fileName,
    });

    await postForm({
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
