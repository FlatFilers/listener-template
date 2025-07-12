# Constraints and Validation


### External Constraints Plugin

Flatfile provides a powerful constraints plugin (`@flatfile/plugin-constraints`) for custom validation logic. This is the recommended way to implement custom validations.

#### Installation

```bash
bun install @flatfile/plugin-constraints
```
#### Usage

1. **In your listener file:**

```typescript
import { externalConstraint } from '@flatfile/plugin-constraints'

export default function(listener: FlatfileListener) {
  listener.use(
    externalConstraint('maxLength', (value, config) => {
      if (value.length > config.max) {
        return { valid: false, message: `Value must be no more than ${config.max} characters long` }
      }
      return { valid: true }
    })
  )
  
  listener.use(
    externalConstraint('minValue', (value, config) => {
      if (value < config.min) {
        return { valid: false, message: `Value must be at least ${config.min}` }
      }
      return { valid: true }
    })
  )
}
```

2. **In your blueprint:**

```typescript
{
  key: 'name',
  type: 'string',
  constraints: [
    { type: 'external', validator: 'maxLength', config: { max: 100 } }
  ]
},
{
  key: 'age',
  type: 'number',
  constraints: [
    { type: 'external', validator: 'minValue', config: { min: 0 } }
  ]
}
```
#### Benefits of External Constraints
- Custom validation logic
- Reusable validation functions
- Access to record context
- Flexible error handling
- Type safety with TypeScript

#### Best Practices for External Constraints
- Keep validation functions pure and focused
- Use descriptive error messages
- Handle edge cases (null, undefined)
- Consider performance for large datasets
- Group related validations
