# Flatfile API Package


The `@flatfile/api` package provides convenient access to the Flatfile API from JavaScript/TypeScript. It includes all the necessary types (such as `SheetConfig`, etc.) and is required for interacting with the API after the initial setup.

### Installation

```bash
bun install @flatfile/api
```
### Usage

```typescript
import type { FlatfileEvent, FlatfileListener } from '@flatfile/listener'
import api, { type Flatfile } from '@flatfile/api'

export default function(listener: FlatfileListener) {
  listener.on('**', async (event: FlatfileEvent) => {
    // Example: Creating a new workbook
    const workbook: Flatfile.WorkbookConfig = {
      name: 'Workbook Name',
      sheets: [
        // sheet definitions
      ]
      //...other config
    }
    // Use the Flatfile API to create the workbook
    const createdWorkbook = await api.workbooks.create(workbook)
  })
}
```
### Key Features

1. **Type Definitions**: Provides TypeScript definitions for Flatfile configurations (`SheetConfig`, etc.).
2. **API Access**: Allows direct interaction with the Flatfile API for operations like creating Workbooks, Sheets, and Jobs.
3. **Post-Setup Operations**: Essential for any API operations needed after the initial Space configuration.

### Best Practices

1. Use `@flatfile/api` for all API interactions after the initial Space setup.
2. Leverage the provided type definitions for better type safety and autocompletion in your IDE.
3. Combine with `@flatfile/plugin-space-configure` for a complete Flatfile integration (initial setup + subsequent API calls).
4. Keep API calls modular and reusable where possible.
5. Handle API errors appropriately and provide meaningful error messages.
