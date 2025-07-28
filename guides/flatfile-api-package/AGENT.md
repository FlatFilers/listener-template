# Flatfile API Packages

## @flatfile/safe-api

The `@flatfile/safe-api` package is the **recommended V2 SDK** for working with files, jobs, records, sheets, spaces, and workbooks. It provides streaming capabilities, automatic pagination, and built-in retry logic while maintaining all original functionality.

### Installation

```bash
bun install @flatfile/safe-api @flatfile/records
```

### Usage

```typescript
import type { FlatfileEvent, FlatfileListener } from '@flatfile/listener'
import api from '@flatfile/safe-api'
import { FlatfileRecord, Collection } from '@flatfile/records'

export default function(listener: FlatfileListener) {
  listener.on('**', async (event: FlatfileEvent) => {
    // Get all records with automatic pagination
    const records = await api.records.stream.simple({ sheetId })
    
    // Stream large datasets efficiently
    for await (const record of api.records.stream.simple({ 
      sheetId, 
      stream: true 
    })) {
      // Process each record
    }
    
    // Create workbooks
    await api.workbooks.create(workbookConfig)
  })
}
```

### Key Features

1. **Streaming API**: Handles large datasets with memory-efficient streaming
2. **Automatic Pagination**: No need to manually handle 10k record limits
3. **Built-in Retries**: Automatic retry logic with rate limit handling
4. **Change Tracking**: Advanced record manipulation with `FlatfileRecord` and `Collection`
5. **Multiple Access Patterns**: Simple, full metadata, streaming, and raw upsert options

## @flatfile/api

The original `@flatfile/api` package is still used for certain operations and provides TypeScript definitions.

### Installation

```bash
bun install @flatfile/api
```

### Usage

For operations not covered by `@flatfile/safe-api`:

```typescript
import api, { type Flatfile } from '@flatfile/api'

// Type definitions for configurations
const workbook: Flatfile.WorkbookConfig = {
  name: 'Workbook Name',
  sheets: [
    // sheet definitions
  ]
}
```

## Package Selection Guide

### Use @flatfile/safe-api for:
- **Records**: All record operations (get, update, delete, stream)
- **Jobs**: Job management and lifecycle operations  
- **Workbooks**: Workbook creation and management
- **Sheets**: Sheet operations and validation
- **Files**: File management operations
- **Spaces**: Space management operations

### Use @flatfile/api for:
- **Type Definitions**: `Flatfile.SheetConfig`, `Flatfile.WorkbookConfig`, etc.
- **Legacy Operations**: Operations not yet available in safe-api
- **Documents**: Document creation and management (until migrated)

### Best Practices

1. **Primary Package**: Use `@flatfile/safe-api` as your primary API package
2. **Type Safety**: Import types from `@flatfile/api` when needed
3. **Streaming**: Use streaming methods for datasets larger than 1,000 records
4. **Error Handling**: Leverage built-in retry logic with appropriate configuration
5. **Change Tracking**: Use `FlatfileRecord` and `Collection` for complex record operations
