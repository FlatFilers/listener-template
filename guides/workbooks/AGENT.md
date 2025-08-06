# Workbooks


### Overview

Workbooks are analogous to a database, with a type-strict schema configuration. They replace traditional spreadsheet templates used for data collection during customer onboarding or file-based data exchange processes. Unlike spreadsheets, Workbooks enable real-time validation, correction, and data import with immediate feedback.

#### Key Capabilities
- Multi-format support beyond CSVs (with extensible file extractors)
- Automatic validation based on predefined rules
- User-friendly interface for data manipulation (add, remove, review, filter, correct)
- Configurable primary Actions for data submission to APIs, databases, or workflows

### Anatomy of a Workbook

A Workbook is represented as an object within an array of workbooks:

```typescript
import { Flatfile } from '@flatfile/api'

const workbook = {
  name: 'Data Import Workbook',
  sheets: [
    // Array of Sheet configurations
  ],
  actions: [
    // Array of Action configurations
  ],
  settings: {
    trackChanges: true,
    noMappingRedirect: false
  }
}

// This workbook would be part of an array when configuring a space
const workbooks = [workbook]
```

#### 1. Sheets Array
Sheets are like database tables or spreadsheet sheets, each with its own schema:

```typescript
sheets: [
  {
    name: 'Customers',
    slug: 'customers',
    fields: [
      // Field configurations
    ]
  },
  {
    name: 'Orders',
    slug: 'orders',
    fields: [
      // Field configurations
    ]
  }
]
```

#### 2. Actions Array
Developer-defined operations that users can trigger on selected data:

```typescript
actions: [
  {
    id: 'submit-to-api',
    label: 'Submit to API',
    description: 'Send validated data to external API',
    primary: true,
    async handler(context) {
      // Action implementation
    }
  },
  {
    id: 'download-pdf',
    label: 'Download as PDF',
    description: 'Export data as PDF report',
    handler(context) {
      // PDF generation logic
    }
  }
]
```

#### 3. Settings Object
Configuration options for Workbook behavior:

```typescript
settings: {
  // Disable actions when commits are pending
  trackChanges: true,
  
  // Prevent automatic redirect to mapping on file drop
  noMappingRedirect: false,
  
  // Additional settings as needed
}
```

#### 4. Labels Array
Organizational and UI-related configurations:

```typescript
labels: [
  'pinned',  // Makes workbook appear first in sidebar
  'custom-label',  // Custom organizational labels
]
```

### Example Workbook Configuration

```typescript
export const importWorkbook = {
  name: 'Product Import System',
  sheets: [
    Products,  // Sheet configuration from separate file
    Categories,  // Sheet configuration from separate file
  ],
  actions: [
    {
      id: 'submit',
      label: 'Submit Data',
      description: 'Submit validated data to database',
      primary: true,
      async handler(context) {
        const { data } = await context.getRecords()
        // Process and submit data
      }
    }
  ],
  settings: {
    trackChanges: true,
    noMappingRedirect: false
  }
}

// This workbook would be used as part of an array when configuring a space
const workbooks = [importWorkbook]
```

### Best Practices for Workbooks

1. **Organization**
   - Group related sheets in a single workbook
   - Use meaningful workbook names
   - Implement appropriate actions for data processing

2. **Configuration**
   - Enable `trackChanges` for data integrity
   - Configure `noMappingRedirect` based on UX requirements
   - Use labels effectively for organization

3. **Actions**
   - Define clear primary actions
   - Include helpful action descriptions
   - Implement proper error handling
   - Provide feedback during processing

4. **Settings**
   - Configure settings based on use case
   - Document any custom settings
   - Consider UX impact of settings
