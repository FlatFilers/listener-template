import api from '@flatfile/api'
import { configureSpace } from '@flatfile/plugin-space-configure'
import { space } from '../blueprints/space.config'
import { workbooks } from '../blueprints/workbooks'

export const configureSpaceHandler = configureSpace(
  {
    workbooks,
    space,
  },
  async (event) => {
    const { spaceId, environmentId } = event.context

    await api.secrets.upsert({
      name: 'FF_AUTO_UPDATE_DEV',
      value: 'true',
      environmentId,
      spaceId,
    })
  },
)
