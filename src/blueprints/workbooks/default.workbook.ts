import type { Flatfile } from '@flatfile/api'
import { actions } from '../actions'
import { sheets } from '../sheets'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  sheets,
  actions,
}
