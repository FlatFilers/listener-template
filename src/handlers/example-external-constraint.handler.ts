import { externalConstraint } from '@flatfile/plugin-constraints'

export const exampleExternalConstraintHandler = externalConstraint(
  'validator-identifier',
  (value, key, { config, record }) => {
    // Always handle null/undefined values first
    if (value == null || value === '') return

    const stringValue = String(value)
    if (!stringValue.includes(config.someConfigValue)) {
      record.addError(key, `Value must include ${config.someConfigValue}`)
    }
  },
)
