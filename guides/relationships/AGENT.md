# Relationships


### Reference Fields

Use reference fields to create relationships between sheets:

```typescript
{
  key: 'relatedRecord',
  type: 'reference',
  label: 'Related Record',
  description: 'Reference to another record',
  constraints: [{ type: 'required' }],
  config: {
    ref: 'related-sheet',
    key: 'uniqueField',
    relationship: 'has-one'
  }
}
```
### Relationship Types

- `has-one`: One-to-one relationship
- Additional relationship types may be supported in future versions
