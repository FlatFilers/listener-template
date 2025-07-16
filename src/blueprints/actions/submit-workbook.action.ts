import { Flatfile } from '@flatfile/api'

export const submitWorkbookAction: Flatfile.Action = {
  operation: 'submit',
  mode: Flatfile.ActionMode.Foreground,
  label: 'Submit',
  description: 'Submits the workbook to Webhook.site',
}
