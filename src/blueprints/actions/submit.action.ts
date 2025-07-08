import { Flatfile } from '@flatfile/api'

export const submitWorkbook: Flatfile.Action = {
  operation: 'submit',
  mode: Flatfile.ActionMode.Foreground,
  label: 'Submit',
  description: 'Submits the workbook to Webhook.site',
}
