import type { Flatfile } from '@flatfile/api'
import { submitWorkbook } from '../actions'
import { exampleSheet } from '../sheets'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  sheets: [exampleSheet],
  actions: [submitWorkbook],
}
