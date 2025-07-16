import { type Flatfile, FlatfileClient } from '@flatfile/api'
import type { FlatfileEvent } from '@flatfile/listener'
import { jobHandler, type TickFunction } from '@flatfile/plugin-job-handler'
import { submitWorkbookAction } from '../blueprints/actions/submit-workbook.action'

const api = new FlatfileClient()

export const submitActionHandler = jobHandler(
  `workbook:${submitWorkbookAction.operation}`,
  async (event: FlatfileEvent, tick: TickFunction) => {
    // TODO: Replace with your webhook url
    const webhookUrl = 'https://webhook.site/...'
    const { payload } = event
    const { workbookId } = event.context

    // Acknowledge the job
    try {
      await tick(10, `Starting job to submit action to ${webhookUrl}`)

      // Collect all Sheet and Record data from the Workbook
      const { data: sheets } = await api.sheets.list({ workbookId })
      const records: { [name: string]: Flatfile.RecordsWithLinks } = {}
      for (const [index, element] of sheets.entries()) {
        const { data } = await api.records.get(element.id)
        records[`Sheet[${index}]`] = data.records
      }

      // Send the data to the webhook url
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          method: 'fetch',
          sheets,
          records,
        }),
      })

      if (response.status !== 200) {
        // If the response is not successful, throw an error
        throw new Error(`Failed to submit data to ${webhookUrl}`)
      }

      // Otherwise, complete the job
      return {
        outcome: {
          message: `Data was successfully submitted. Go check it out at ${webhookUrl}.`,
        },
      }
    } catch (error) {
      // If an error is thrown, fail the job by throwing an error
      throw new Error(`Job failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },
)
