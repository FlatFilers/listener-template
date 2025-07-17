import { type Flatfile, FlatfileClient } from '@flatfile/api'
import type { FlatfileEvent } from '@flatfile/listener'
import { jobHandler, type TickFunction } from '@flatfile/plugin-job-handler'

const api = new FlatfileClient()

export const exampleJobHandler = jobHandler('workbook:operation', async (event: FlatfileEvent, tick: TickFunction) => {
  try {
    // TODO: Do something

    // Otherwise, complete the job
    return {
      outcome: {
        message: 'Job completed successfully',
      },
    } as Flatfile.JobCompleteDetails
  } catch (error) {
    // If an error is thrown, fail the job by throwing an error
    throw new Error(`Job failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})
