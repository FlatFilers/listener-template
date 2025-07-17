import type { Flatfile } from '@flatfile/api'
import { exampleWorkbookAction } from '../actions/example-workbook.action'
import { exampleSheet } from '../sheets/example.sheet'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  sheets: [exampleSheet],
  actions: [exampleWorkbookAction],
}
