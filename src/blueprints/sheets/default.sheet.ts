import type { Flatfile } from '@flatfile/api'

export const defaultSheet: Flatfile.SheetConfig = {
  name: 'Sheet',
  slug: 'sheet',
  fields: [
    {
      key: 'name',
      type: 'string',
      label: 'Name',
    },
  ],
}
