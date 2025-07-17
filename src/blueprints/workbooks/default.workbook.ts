import type { Flatfile } from '@flatfile/api'
import { actions } from '../actions'
import { exampleSheet } from '../sheets'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  sheets: [exampleSheet],
  actions,
}
