import type { Flatfile } from '@flatfile/api'
import { submitWorkbook } from '../actions'
import { exampleSheet } from '../sheets'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  labels: ['pinned'],
  sheets: [exampleSheet],
  actions: [submitWorkbook],
}
