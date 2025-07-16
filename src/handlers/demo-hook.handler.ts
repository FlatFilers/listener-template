import type { FlatfileEvent } from '@flatfile/listener'
import { bulkRecordHook, type FlatfileRecord } from '@flatfile/plugin-record-hook'

// This is an example data hook that will be called when a record is created or updated on the default sheet with slug 'demo'
export const demoRecordHookHandler = bulkRecordHook(
  'demo',
  async (records: FlatfileRecord[], _event: FlatfileEvent) => {
    records.forEach((record) => {
      const name: string = record.get('name') as string
      if (name.length > 0) {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
        if (name !== capitalizedName) {
          record.set('name', capitalizedName)
        }
      }
    })
  },
)
