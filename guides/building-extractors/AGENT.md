# How to Write an Extractor

This guide explains how to create a new extractor plugin for the Flatfile ecosystem using the `@flatfile/util-extractor` utility.

## Overview

An extractor is a plugin that processes uploaded files and converts them into workbooks with sheets containing structured data. The `@flatfile/util-extractor` provides a standard framework that handles common tasks like file detection, job management, workbook creation, and progress tracking.

## Basic Structure

Every extractor follows this pattern:

```typescript
import { Extractor } from '@flatfile/util-extractor'
import { parseBuffer } from './parser'

export interface ExtractorOptions {
  // Define your options here
  chunkSize?: number
  parallel?: number
  debug?: boolean
  // ... other options
}

export const MyExtractor = (options?: ExtractorOptions) => {
  return Extractor(
    fileExtension,     // File extension(s) to match
    'extractorType',   // Unique identifier for your extractor
    parseBuffer,       // Your parsing function
    options           // Configuration options
  )
}

export const myParser = parseBuffer
```

## Core Components

### 1. The Extractor Function

The `Extractor` function from `@flatfile/util-extractor` takes four parameters:

- **`fileExt`**: `string | RegExp` - File extension(s) to match
- **`extractorType`**: `string` - Unique identifier for your extractor
- **`parseBuffer`**: `function` - Your parsing function
- **`options`**: `object` - Configuration options

### 2. File Extension Matching

You can specify file extensions in two ways:

```typescript
// String - matches exact extension
Extractor('.json', 'json', parseBuffer, options)

// RegExp - matches multiple extensions
Extractor(/\.(xlsx?|xlsm|xlsb|xltx?|xltm)$/i, 'excel', parseBuffer, options)
```

### 3. The Parser Function

The parser function is where you implement the file-specific logic:

```typescript
export function parseBuffer(
  buffer: Buffer,
  options?: YourOptionsType
): WorkbookCapture | Promise<WorkbookCapture> {
  // Your parsing logic here
  return workbookCapture
}
```

The parser must return a `WorkbookCapture` object:

```typescript
type WorkbookCapture = Record<string, SheetCapture>

type SheetCapture = {
  headers: string[]
  descriptions?: Record<string, null | string> | null
  data: Flatfile.RecordData[]
  metadata?: { rowHeaders: number[] }
}
```

## Step-by-Step Implementation

### Step 1: Set Up Your Plugin Structure

Create a new directory for your extractor:

```
plugins/my-extractor/
├── src/
│   ├── index.ts
│   └── parser.ts
├── package.json
└── README.md
```

### Step 2: Define Your Options Interface

```typescript
export interface MyExtractorOptions {
  readonly chunkSize?: number
  readonly parallel?: number
  readonly debug?: boolean
  // Add specific options for your file type
  readonly customOption?: string
}
```

### Step 3: Implement the Parser Function

```typescript
import { SheetCapture, WorkbookCapture } from '@flatfile/util-extractor'

export function parseBuffer(
  buffer: Buffer,
  options?: MyExtractorOptions
): WorkbookCapture {
  // Convert buffer to string or parse binary data
  const fileContents = buffer.toString('utf8')
  
  // Parse the file contents
  const parsedData = parseYourFileFormat(fileContents, options)
  
  // Convert to WorkbookCapture format
  const workbookCapture: WorkbookCapture = {}
  
  // For each sheet in your file
  parsedData.sheets.forEach((sheet, index) => {
    const sheetName = sheet.name || `Sheet${index + 1}`
    
    workbookCapture[sheetName] = {
      headers: extractHeaders(sheet),
      data: extractData(sheet),
      descriptions: extractDescriptions(sheet), // optional
      metadata: extractMetadata(sheet) // optional
    }
  })
  
  return workbookCapture
}
```

### Step 4: Create the Main Extractor Function

```typescript
import { Extractor } from '@flatfile/util-extractor'
import { parseBuffer } from './parser'

export const MyExtractor = (options?: MyExtractorOptions) => {
  return Extractor(
    '.myext', // or /\.(ext1|ext2)$/i for multiple extensions
    'myextractor',
    parseBuffer,
    options
  )
}
```

### Step 5: Export Everything

```typescript
export { MyExtractor, parseBuffer as myParser }
export type { MyExtractorOptions }
```

## Examples from the Codebase

### Simple Example: JSON Extractor

```typescript
import { Extractor } from '@flatfile/util-extractor'
import { parseBuffer } from './parser'

export interface PluginOptions {
  chunkSize?: number
  parallel?: number
  debug?: boolean
}

export const JSONExtractor = (options?: PluginOptions) => {
  return Extractor(/\.(jsonl?|jsonlines)$/i, 'json', parseBuffer, options)
}
```

### Complex Example: Excel Extractor

```typescript
export interface ExcelExtractorOptions {
  readonly raw?: boolean
  readonly rawNumbers?: boolean
  readonly dateNF?: string
  readonly headerDetectionOptions?: GetHeadersOptions
  readonly skipEmptyLines?: boolean
  readonly chunkSize?: number
  readonly parallel?: number
  readonly debug?: boolean
  readonly mergedCellOptions?: {
    acrossColumns?: {
      treatment: 'applyToAll' | 'applyToTopLeft' | 'coalesce' | 'concatenate'
      separator?: string
    }
    // ... more options
  }
}

export const ExcelExtractor = (options?: ExcelExtractorOptions) => {
  return Extractor(
    /\.(xlsx?|xlsm|xlsb|xltx?|xltm)$/i,
    'excel',
    parseBuffer,
    options
  )
}
```

## Data Processing Best Practices

### 1. Header Handling

```typescript
// Extract headers from your data
const headers = extractHeaders(data)

// Handle duplicate headers
const uniqueHeaders = headers.map((header, index) => {
  const count = headers.slice(0, index).filter(h => h === header).length
  return count > 0 ? `${header}_${count}` : header
})
```

### 2. Data Transformation

```typescript
// Convert your data to Flatfile format
const data = rawData.map(row => {
  const recordData: Flatfile.RecordData = {}
  headers.forEach((header, index) => {
    recordData[header] = {
      value: row[index] || null
    }
  })
  return recordData
})
```

### 3. Error Handling

```typescript
export function parseBuffer(
  buffer: Buffer,
  options?: MyExtractorOptions
): WorkbookCapture {
  try {
    // Your parsing logic
    return workbookCapture
  } catch (error) {
    if (options?.debug) {
      console.error('Parser error:', error)
    }
    throw new Error(`Failed to parse file: ${error.message}`)
  }
}
```

## Standard Options

All extractors should support these standard options:

```typescript
interface StandardOptions {
  readonly chunkSize?: number    // Default: 5000
  readonly parallel?: number     // Default: 1
  readonly debug?: boolean       // Default: false
}
```

## Testing

Create test files to verify your extractor:

```typescript
import { MyExtractor } from '../src'
import { readFileSync } from 'fs'

describe('MyExtractor', () => {
  it('should parse valid files', async () => {
    const buffer = readFileSync('path/to/test/file.myext')
    const result = await parseBuffer(buffer)
    
    expect(result).toBeDefined()
    expect(result.Sheet1.headers).toEqual(['col1', 'col2'])
    expect(result.Sheet1.data).toHaveLength(2)
  })
})
```

## What the Extractor Utility Handles

The `@flatfile/util-extractor` automatically handles:

- File detection based on extension
- Job creation and management
- Progress tracking and reporting
- Workbook and sheet creation
- Record insertion with chunking
- Error handling and job completion
- File status updates
- Header selection enablement
- Source editor configuration

## What You Need to Implement

You only need to implement:

- The `parseBuffer` function
- File format-specific parsing logic
- Options interface for your extractor
- Data transformation to `WorkbookCapture` format

## Advanced Features

### Multi-Sheet Support

```typescript
const workbookCapture: WorkbookCapture = {}

sheets.forEach((sheet, index) => {
  workbookCapture[sheet.name || `Sheet${index + 1}`] = {
    headers: sheet.headers,
    data: sheet.data,
    descriptions: sheet.descriptions,
    metadata: sheet.metadata
  }
})
```

### Header Descriptions

```typescript
const sheetCapture: SheetCapture = {
  headers: ['name', 'email', 'age'],
  descriptions: {
    name: 'Full name of the person',
    email: 'Email address',
    age: 'Age in years'
  },
  data: rowData
}
```

### Metadata for Header Selection

```typescript
const sheetCapture: SheetCapture = {
  headers: ['col1', 'col2'],
  data: rowData,
  metadata: {
    rowHeaders: [0, 1, 2] // Indicates which rows contain headers
  }
}
```

## Deployment

1. Build your plugin: `npm run build`
2. Test thoroughly with various file formats
3. Update documentation
4. Submit for review

## Common Pitfalls

1. **Not handling empty files**: Always check if the buffer is empty
2. **Incorrect header normalization**: Use the built-in `normalizeKey` function
3. **Missing error handling**: Wrap parsing logic in try-catch blocks
4. **Ignoring file size limits**: Handle large files gracefully
5. **Not following naming conventions**: Use consistent naming for exports

## Resources

- [Extractor Utility Source Code](https://github.com/FlatFilers/flatfile-plugins/blob/main/utils/extractor/src/index.ts)
- [Excel Extractor Example](https://github.com/FlatFilers/flatfile-plugins/blob/main/plugins/xlsx-extractor/src/index.ts)
- [JSON Extractor Example](https://github.com/FlatFilers/flatfile-plugins/blob/main/plugins/json-extractor/src/index.ts)
- [XML Extractor Example](https://github.com/FlatFilers/flatfile-plugins/blob/main/plugins/xml-extractor/src/index.ts)
