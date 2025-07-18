# Job Handler Plugin


The `@flatfile/plugin-job-handler` plugin is designed to streamline handling Flatfile Jobs, which are large units of work performed asynchronously on resources such as Spaces, Workbooks, Sheets, or Files.

### Installation

```bash
bun install @flatfile/plugin-job-handler
```
### Usage

```typescript
import type { FlatfileEvent, FlatfileListener } from '@flatfile/listener'
import { type TickFunction, jobHandler } from '@flatfile/plugin-job-handler'

export default function(listener: FlatfileListener) {
  listener.use(
    jobHandler('domain:operation', async (event: FlatfileEvent, tick: TickFunction) => {
      try {
        await tick(1, 'Starting job...')
        // Your code here...
        await tick(50, 'Halfway there!') // update Job progress
        // ...continue your code...

        // Returning an outcome will complete the job
        return {
          outcome: {
            message: 'Job complete',
          },
        }
      } catch (error) {
        throw error // will fail the Job
      }
    })
  )
}
```
### Key Features

1. **Job Event Handling**: Listens for the `job:ready` event and filters based on the specified job parameter.
2. **Progress Tracking**: Provides a `tick` function to update job progress and send status messages.
3. **Error Handling**: Allows for custom error handling and job failure reporting.
4. **Customizable Outcomes**: Enables returning custom job outcomes upon successful completion.

### Best Practices

1. Use descriptive job names (e.g., `workbook:export` or `sheet:validate`) for better organization and debugging.
2. Implement proper error handling to ensure jobs fail gracefully and provide useful error messages.
3. Use the `tick` function to provide regular progress updates, especially for long-running jobs.
4. Consider using the debug option for detailed logging during development and troubleshooting.
5. Structure your job handler code to be modular and reusable across different job types when possible.
