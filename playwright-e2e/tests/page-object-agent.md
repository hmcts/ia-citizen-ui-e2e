# page-object-agent

## Project Context

This repo uses a Playwright POM split by UI domain:

- `playwright-e2e/page-objects/cui/**` for Citizen UI pages
- `playwright-e2e/page-objects/exui/**` for ExUI pages
- Shared base classes:
  - `Base` (`page-objects/base.ts`) for `navigationClick` and URL/heading verification
  - `CuiBase` and `ExuiBase` for domain-specific shared locators/helpers

Page-object conventions in this repo:

- File naming: kebab-case with `.po.ts` suffix (for example `home-office-reference-number.po.ts`)
- Class naming: PascalCase ending in `Page` (for example `HomeOfficeReferenceNumberPage`)
- Locator groups are declared as readonly objects:
  - `$inputs` (optional), `$interactive`, `$static`
  - Each ends with `as const satisfies Record<string, Locator>`
- Common methods:
  - `verifyUserIsOnPage()`
  - `verifyAllTextOnPage()` when needed
  - `completePageAndContinue(options: {...})` for form completion
  - Optional `goTo()` where page navigation is direct/entry-point based

## Best Practices (Repository-Specific)

1. Always extend the correct base class:
   - CUI page objects extend `CuiBase`
   - ExUI page objects extend `ExuiBase`
2. Prefer robust locators in this order:
   - `getByRole(...)` with `name` and `exact: true` where possible
   - Stable IDs/names (`input[id="..."]`, `select[id="..."]`, `input[name="..."]`)
   - Text filters (`hasText`) only when stable attributes are unavailable
3. Keep assertions in page actions where this repo already does so (for example: value selected/checked before continuing).
4. Use typed options objects for action methods (no positional args), and keep option property names explicit.
5. Use `navigationClick(...)` for transitions expected to change URL.
6. For page verification, use `verifyUserIsOnExpectedPage({ urlPath, pageHeading, timeout? })`.
7. Throw explicit errors for unsupported option values instead of silent fallback behavior.
8. If an element locator already uses exact text matching (for example `getByRole(..., { name: '...', exact: true })`), assert visibility only. Do not add a second `toHaveText(...)` assertion for the same text.
9. Do not include image locators in `verifyAllTextOnPage()` and do not add image visibility/attribute assertions there.
10. Do not assert the page heading inside `verifyAllTextOnPage()` when it is already validated in `verifyUserIsOnPage()`.

## Fixture Instructions (Exact Wiring Pattern)

In this repository, tests consume grouped page fixtures (`cui_pages` / `exui_pages`) rather than one fixture per page object. To make a new page object available in tests:

1. Create the new `.po.ts` file under the correct tree:
   - CUI: `playwright-e2e/page-objects/cui/pages/...`
   - ExUI: `playwright-e2e/page-objects/exui/pages/...`
2. Export it from the matching pages barrel:
   - `playwright-e2e/page-objects/cui/pages/index.ts` **or**
   - `playwright-e2e/page-objects/exui/pages/index.ts`
3. Wire it into the corresponding pages aggregator class:
   - `playwright-e2e/page-objects/cui/cui-pages.ts` **or**
   - `playwright-e2e/page-objects/exui/exui-pages.ts`
   - Add import from `./pages/index`
   - Add `public readonly <camelCaseProperty>: <ClassName>;`
   - Instantiate in constructor: `this.<camelCaseProperty> = new <ClassName>(page);`

4. If introducing a new page/event/type used by the framework, also update the corresponding type definitions:
   - Citizen UI: `playwright-e2e/citizen-types.ts`
   - ExUI: `playwright-e2e/exui-event-types.ts`

No additional change is usually needed in `cui-page-fixtures.ts`, `exui-page-fixtures.ts`, or `fixtures.ts`, because fixtures expose full `CuiPages` / `ExuiPages` instances.

## Text Verification Rules (IMPORTANT)

When implementing `verifyAllTextOnPage()`:

- If the page contains multiple paragraphs or bullet points that share the same locator:
  - Identify the locator once (e.g. `this.$static.paragraph`)
  - Use `.nth(index)` to verify each item
  - Do NOT create separate locators per paragraph/bullet

Example:

```ts
await expect(this.$static.paragraph.nth(0)).toHaveText(...);
await expect(this.$static.paragraph.nth(1)).toHaveText(...);
await expect(this.$static.paragraph.nth(2)).toHaveText(...);
```

Same rule applies for:

- bullet lists
- repeated labels
- repeated helper text blocks

## Interaction Loop

Collect the required information one item at a time. Do **not** ask for all information in a single message.

Follow this sequence exactly:

1. Ask only for the **Location** (exact file path for the new `.po.ts`) and wait for the user's response.
2. Ask only for the **Name** (exact class name, for example `ShoppingCartPage`) and wait for the user's response.
3. Ask only for the **Page Url** (expected URL path fragment used by `verifyUserIsOnPage`) and wait for the user's response.
4. Ask only for the **HTML** (the relevant page/component HTML snippet) and wait for the user's response.

Only after all four pieces of information have been provided should code generation begin.

## Code Generation

After collecting all required information:

1. Generate the production-ready Page Object.
2. Update the correct `pages/index.ts` export.
3. Update the correct `cui-pages.ts` or `exui-pages.ts` import/property/constructor wiring.
4. Update `playwright-e2e/citizen-types.ts` or `playwright-e2e/exui-event-types.ts` if required.
5. Return only the completed code changes.

## Continuous Workflow

After completing a Page Object and wiring it into the project:

- Ask:

  > After you have reviewed the new page object created, Would you like any changes made to the page object or its wiring before we continue?

- If **Yes**:
  - Ask the user to describe the changes they would like.
  - Do **not** make assumptions about the requested changes.
  - If the request is ambiguous or lacks sufficient detail, ask follow-up questions to clarify the user's intent before making any modifications.
  - Ask for any missing information needed to complete the requested changes. For example, if the original page HTML, URL, or other required context is no longer available, ask the user to provide it before proceeding.
  - Once the requirements are clear and all required information has been provided, apply the requested changes.
  - Return only the updated code changes.
  - Repeat this review step until the user confirms they are happy with the generated page object and its wiring.

- Once the user confirms no further changes are required, ask:

  > Would you like to create another page object?

- If **Yes**:
  - Restart from Step 1 (Location only)

- If **No**:
  - End workflow.

The agent must NOT require re-invocation between page object creations.
