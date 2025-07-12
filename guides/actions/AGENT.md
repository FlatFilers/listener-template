# Actions


Actions are code-based operations that run when triggered by user interaction in Flatfile. They can be mounted on Spaces, Workbooks, Sheets, or Fields, providing a flexible way to implement custom functionality.

### Types of Actions

#### Built-in Actions
Flatfile provides five default actions:
- Mapping data between workbooks
- Deleting data from a Workbook
- Exporting (downloading) data
- Find and Replace in a Sheet
- Applying Mutate functions to Sheet data

These actions create Jobs when triggered, which can be monitored and handled through event listeners.

#### Developer-Created Actions
Custom actions can be mounted at various levels:
- Sheet level
- Workbook level
- File level

When triggered, these actions create jobs with names following the pattern: `{domain}:{operation}` (e.g., `workbook:my-action`).

### Action Configuration

#### Required Parameters

```typescript
{
  // Unique identifier used by the listener
  operation: 'submit-data',
  
  // UI display text
  label: 'Submit Data'
}
```
#### Optional Parameters

```typescript
{
  // Makes the action more prominent in UI
  primary: true,
  
  // Shows confirmation modal
  confirm: true,
  
  // Confirmation modal text
  description: 'Are you sure you want to submit this data?',
  
  // UI icon (default: lightning bolt)
  icon: 'upload',
  
  // Hover tooltip
  tooltip: 'Submit data to external API',
  
  // Tooltip messages for different states
  messages: [
    { type: 'error', message: 'Cannot submit invalid data' },
    { type: 'info', message: 'Ready to submit' }
  ],
  
  // Action constraints
  constraints: [
    { type: 'hasAllValid' },    // Requires all records valid
    { type: 'hasSelection' },   // Requires selected records
    { type: 'hasData' }         // Requires data present
  ],
  
  // Action execution mode
  mode: 'background'  // or 'foreground' or 'toolbarBlocking'
}
```

### Input Forms

Actions can request additional information from users through input forms:

```typescript
{
  operation: 'export-data',
  label: 'Export Data',
  inputForm: {
    type: 'simple',
    fields: [
      {
        key: 'fileName',
        label: 'File Name',
        type: 'string',
        description: 'Name for the exported file',
        defaultValue: 'export',
        constraints: [{ type: 'required' }]
      },
      {
        key: 'format',
        label: 'Export Format',
        type: 'enum',
        description: 'Choose export format',
        config: {
          options: [
            {
              value: 'csv',
              label: 'CSV',
              description: 'Comma-separated values'
            },
            {
              value: 'json',
              label: 'JSON',
              description: 'JavaScript Object Notation'
            }
          ]
        },
        constraints: [{ type: 'required' }]
      }
    ]
  }
}
```

### Complete Action Example

```typescript
export const submitAction = {
  operation: 'submit-data',
  label: 'Submit Data',
  primary: true,
  confirm: true,
  description: 'Submit this data to the external API?',
  icon: 'upload',
  tooltip: 'Submit validated data',
  constraints: [
    { type: 'hasAllValid' },
    { type: 'hasData' }
  ],
  mode: 'foreground',
  inputForm: {
    type: 'simple',
    fields: [
      {
        key: 'priority',
        label: 'Priority Level',
        type: 'enum',
        description: 'Set the processing priority',
        defaultValue: 'normal',
        config: {
          options: [
            {
              value: 'high',
              label: 'High Priority',
              description: 'Process immediately'
            },
            {
              value: 'normal',
              label: 'Normal Priority',
              description: 'Process in order'
            }
          ]
        },
        constraints: [{ type: 'required' }]
      }
    ]
  }
}

// Using the action in a workbook
export const workbook: {
  name: 'Data Import',
  sheets: [...],
  actions: [submitAction]
}
```
### Best Practices for Actions

1. **Naming and Organization**
   - Use descriptive operation names
   - Group related actions logically
   - Consider action hierarchy (workbook vs sheet level)

2. **User Experience**
   - Provide clear labels and descriptions
   - Use appropriate icons and tooltips
   - Implement meaningful constraints

3. **Input Forms**
   - Request only necessary information
   - Provide clear field descriptions
   - Use appropriate field types
   - Set sensible default values

4. **Error Handling**
   - Implement proper validation
   - Provide clear error messages
   - Handle edge cases gracefully

5. **Performance**
   - Use appropriate execution modes
   - Consider background processing for long-running operations
   - Implement progress indicators for lengthy tasks
