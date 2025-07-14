# Field Types


Flatfile supports various field types to handle different kinds of data:

### String

A property that should be stored and read as a basic string.

```typescript
{
  key: 'fieldName',
  type: 'string',
  label: 'Field Label',
  description: 'Field description',
  constraints: [
    { type: 'required' },
    { type: 'external', validator: 'length', config: { max: 100 } }
  ]
}
```

### String List

A property that stores an array of strings. This is useful for fields that need to contain multiple text values.

```typescript
{
  key: 'strings',
  type: 'string-list',
  label: 'String List',
}
```
### Number

A property that should be stored and read as either an integer or floating point number.

```typescript
{
  key: 'price',
  type: 'number',
  label: 'Price',
  description: 'Product price',
  config: {
    decimal_places: 2
  }
}
```
### Enum

Defines an enumerated list of options for the user to select from. The maximum number of options for this list is 100.

`config.allow_custom`
Permit the user to create new options for this specific field.

`config.sortBy`
The field to sort the options by (label, value, ordinal).

`config.options`
An array of valid options the user can select from.

```typescript
{
  key: 'status',
  type: 'enum',
  label: 'Status',
  description: 'Item status',
  config: {
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
}
```
### Enum List

Similar to `enum` type but allows multiple selections from the options list. The values are stored as an array.

```typescript
{
  key: 'enum-list',
  type: 'enum-list',
  label: 'Enum List',
  config: {
    options: [
      {
        value: 'red',
        label: 'Red',
      },
      {
        value: 'blue',
        label: 'Blue',
      },
      {
        value: 'green',
        label: 'Green',
      },
    ],
  },
}
```
### Reference

Defines a singular one-to-one reference to a field another sheet.

`config.ref`
The sheet slug of the referenced field. Must be in the same workbook.

`config.key`
The key of the property to use as the reference key.

```typescript
{
  key: 'parentId',
  type: 'reference',
  label: 'Parent Record',
  description: 'Reference to parent record',
  config: {
    ref: 'parent-sheet',
    key: 'id',
    relationship: 'has-one'
  }
}
```
### Boolean

A true or false value type. Usually displayed as a checkbox.

`config.allowIndeterminate`
Allow a neither true or false state to be stored as null.

```typescript
{
  key: 'isActive',
  type: 'boolean',
  label: 'Active Status',
  description: 'Whether the item is active'
}
```
### Date

Store a field as a GMT date. Data hooks must convert this value into a `YYYY-MM-DD` format in order for it to be considered a valid value.

```typescript
{
  key: 'createdAt',
  type: 'date',
  label: 'Created Date',
  description: 'Record creation date'
}
```