# Flatfile Listener

This is a Flatfile listener that uses the core patterns for building event-driven data import workflows. Listeners are the foundation of Flatfile's architecture—they respond to events throughout the data import lifecycle and enable all the powerful functionality in your Flatfile implementation.

## About Listeners

Listeners are functions you write that respond to Events by executing custom code. They define how your Spaces behave and what happens when users interact with your data. This listener shows how to handle the most common listener patterns:

- **Space Configuration**: Setting up workbooks, sheets, actions, and themes
- **Data Validation**: Custom field and record-level validation using hooks
- **Job Processing**: Handling long-running operations like file extraction and data submission
- **File Operations**: Processing uploaded XLSX files with automatic extraction
- **User Interactions**: Responding to custom actions and button clicks

This listener specifically is built for an "Autobuild App" workflow.

## Project Structure

```
src/
├── index.ts           # Main listener entry point
├── blueprints/        # Configuration files
│   ├── actions/       # Action configurations
│   ├── sheets/        # Sheet configurations
│   ├── workbooks/     # Workbook configurations
│   └── space.ts       # Space configuration
└── handlers/          # Event handlers
    ├── configure-space.handler.ts
    ├── demo-hook.handler.ts
    └── submit-action.handler.ts
```

## Build & Commands

- Check code for errors: `bun run check` (runs biome check and TypeScript type checking)
- Fix linting/formatting: `bun run fix` (runs biome check with --write to auto-fix)
- Start development server: `bun run dev`
- Deploy listener to Flatfile: `bun run deploy`
- List all listeners: `bun run list`
- Delete listener: `bun run delete`

### Development Environment

- Uses Flatfile CLI for development and deployment
- Requires `.env` file with Flatfile API key and environment ID
- Webhook URL needs to be updated in `src/index.ts`
- Package manager: bun (preferred), npm/yarn/pnpm also supported

## Code Style

### TypeScript Guidelines

- Use English for all code and documentation
- Always declare types for variables and functions (parameters and return values)
- Avoid using `any` - create necessary types instead
- Use JSDoc to document public classes and methods
- Don't leave blank lines within functions
- One export per file

### Naming Conventions

- **PascalCase** for classes and sheet configurations
- **camelCase** for variables, functions, and methods
- **kebab-case** for file and directory names
- **UPPERCASE** for environment variables
- Start function names with verbs
- Use verbs for boolean variables (`isLoading`, `hasError`, `canDelete`)
- Use complete words instead of abbreviations

### Function Guidelines

- Write short functions with single purpose (less than 20 instructions)
- Use early returns to avoid nesting
- Use arrow functions for simple operations (less than 3 instructions)
- Use named functions for complex operations
- Use default parameter values instead of null/undefined checks

### Formatting

- TypeScript: Uses strict configuration with @total-typescript/tsconfig
- Biome for linting and formatting
- 2 spaces indentation
- Single quotes for strings
- Semicolons only when needed
- Trailing commas everywhere
- 120 character line limit
- Organize imports enabled
- No explicit any (warns)
- No unused variables/imports (errors)
- No non-null assertions allowed

## Architecture

### Flatfile Development Rules

1. **Custom Validations**: Always use `@flatfile/plugin-constraints` for custom field-level validations
2. **Record Hooks**: Use `@flatfile/plugin-record-hook` for record-level validations or complex multi-field validations
3. **Performance**: Choose `recordHook` for individual record validations, `bulkRecordHook` for large datasets
4. **Blueprint**: Use `external` constraint type to reference custom validations
5. **Type Safety**: Always use TypeScript for better type safety

### Event Listener Structure

```typescript
export default function(listener: FlatfileListener) {
  // Global event handling
  listener.on('**', (event) => {
    console.log(`Received event: ${event.topic}`)
  })

  // Space configuration
  listener.on('job:ready', { job: 'space:configure' }, async (event) => {
    // Configure workbooks, sheets, and actions
  })

  // Data processing hooks
  listener.use(recordHook('sheetName', (record) => {
    // Transform and validate data
  }))
}
```

### Plugins Used

- `@flatfile/plugin-xlsx-extractor` for Excel file handling
- `@flatfile/plugin-space-configure` for space configuration
- `@flatfile/plugin-job-handler` for job processing
- `@flatfile/plugin-record-hook` for data transformation

## Testing

- No specific test framework configured
- Use `bun run check` to verify TypeScript compilation
- Manual testing via `bun run dev` for development
- Test files use `*.test.ts` or `*.spec.ts` naming convention
- Use descriptive test names without "should" prefix
- Mock external dependencies appropriately

## Flatfile Components

### Workbooks and Sheets

- Workbooks are like databases with type-strict schemas
- Sheets are like database tables with field definitions
- Actions define user-triggered operations
- Configure in separate files for better organization

### Event System

- `job:ready` - Handle job execution
- `commit:created` - Process record changes
- `workbook:created` - Handle new workbook creation
- `sheet:updated` - Respond to sheet modifications

### Data Hooks

- Use `recordHook` for individual record processing
- Use `bulkRecordHook` for batch operations
- Implement `compute`, `computeIfPresent`, and `validate` methods
- Add informational, warning, and error messages

## Security

- Never commit API keys or secrets to repository
- Use environment variables for sensitive data
- Store credentials in `.env` file (not committed)
- Validate webhook URLs before deployment
- Use latest versions of Flatfile dependencies for security patches
- Validate all user inputs in data hooks
- Handle edge cases including null and undefined values
- Implement proper error handling and logging

## Configuration

Before first use:
1. Copy `.env.example` to `.env`
2. Add your Flatfile API key and environment ID
3. Update webhook URL in `src/index.ts` (replace `https://webhook.site/...`)

### Required Packages

```bash
bun install @flatfile/api @flatfile/listener
bun install @flatfile/plugin-constraints @flatfile/plugin-record-hook
```

### Environment Setup

- Configure listener entry point in `src/index.ts`
- Define sheet configurations in `src/blueprints/sheets/`
- Implement custom validations in handlers
- Use TypeScript for all configurations

## Deployment

- Use `bun run deploy` to deploy to Flatfile
- Listeners run in AWS Lambda when deployed
- Development mode includes additional logging (disabled in production)
- Use `bun run list` to see deployed listeners

## Best Practices

### File Organization

- One sheet configuration per file
- Use descriptive file names
- Export configurations through index files
- Keep validation logic modular and reusable

### Error Handling

- Use exceptions for unexpected errors
- Provide clear error messages in validations
- Handle all edge cases appropriately
- Implement proper logging

### Performance

- Use appropriate hook types for dataset size
- Consider performance implications of validations
- Implement efficient data transformations
- Test with realistic data volumes

## References

- [Flatfile Documentation](https://flatfile.com/docs)
- [Workbooks](@guides/workbooks/AGENT.md)
- [Actions](@guides/actions/AGENT.md)
- [Events](@guides/events/AGENT.md)
- [Jobs](@guides/jobs/AGENT.md)
- [Listeners](@guides/listeners/AGENT.md)
- [Data Hooks](@guides/data-hooks/AGENT.md)
- [Blueprint Overview](@guides/blueprint-overview/AGENT.md)
- [Sheet Configuration](@guides/sheet-configuration/AGENT.md)
- [Field Types](@guides/field-types/AGENT.md)
- [Constraints and Validation](@guides/constraints-and-validation/AGENT.md)
- [Best Practices](@guides/best-practices/AGENT.md)
- [Examples](@guides/examples/AGENT.md)
- [Space Configuration Plugin](@guides/space-configuration-plugin/AGENT.md)
- [Job Handler Plugin](@guides/job-handler-plugin/AGENT.md)
- [Flatfile API Package](@guides/flatfile-api-package/AGENT.md)
- [Package Usage](@guides/package-usage/AGENT.md)
- [Workbook Configuration](@guides/workbook-configuration/AGENT.md)
- [External Validations](@guides/external-validations/AGENT.md)
