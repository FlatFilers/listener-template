import type { Flatfile } from '@flatfile/api'
import { exampleWorkbookAction } from '../actions/example-workbook-action.config'
import { exampleSheet } from '../sheets/example-sheet.config'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  sheets: [exampleSheet],
  actions: [exampleWorkbookAction],
}
