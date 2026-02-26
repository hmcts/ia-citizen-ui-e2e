import { Locator } from '@playwright/test';
import { Base } from '../base';

// A base page inherited by pages & components
// can contain any additional config needed + reusable methods accross CUI pages
export abstract class CuiBase extends Base {
  public readonly $headerComponent = {
    signOutLink: this.page.getByRole('link', { name: 'Sign out', exact: true }),
  } as const satisfies Record<string, Locator>;
}
