# Data Hooks


Data Hooks are concise functions that automatically re-format, correct, validate, and enrich data during the data import process. They operate at the record level, providing access to all fields in a row and are ideal for operations requiring multiple field access or new field creation.

### Getting Started

```typescript
import type { FlatfileListener } from '@flatfile/listener'
import { recordHook, FlatfileRecord } from '@flatfile/plugin-record-hook'

export default function(listener: FlatfileListener) {
  // Basic record hook structure
  listener.use(
    recordHook('sheetName', (record) => {
      // Manipulate record here
      return record
    })
  )
}
```
### Record Methods

#### 1. compute

Computes a new value for a field, running even when no value is set.

```typescript


// Example: Generate email from first and last name
listener.use(
  recordHook('contacts', (record) => {
    record.compute(
      'email',
      (email, record) => 
        `${record.get('firstName')}${record.get('lastName')}@gmail.com`,
      'Email was generated from first and last name.'
    )
    return record
  })
)
```
#### 2. computeIfPresent

Similar to compute but only runs when an initial value exists.

```typescript
// Example: Convert email to lowercase
listener.use(
  recordHook('contacts', (record) => {
    record.computeIfPresent(
      'email',
      (email) => email.toLowerCase(),
      'Email was converted to lowercase.'
    )
    return record
  })
)
```
#### 3. validate

Validates field values against specified conditions.

```typescript
interface ValidateMethod {
  fieldName: string
  validator: (value: any, record: FlatfileRecord) => boolean
  message: string
}

// Example: Validate last name format
listener.use(
  recordHook('contacts', (record) => {
    record.validate(
      'lastName',
      (value) => !/\d/.test(value.toString()),
      'Last name cannot contain numbers'
    )
    return record
  })
)
```
### Record Messages

#### 1. Information Messages

```typescript
// Add informational message
record.addInfo(
  'email', 
  'This email was verified.'
)

// Add info to multiple fields
record.addInfo(
  ['firstName', 'lastName'],
  'Name fields were validated.'
)
```
#### 2. Error Messages

```typescript
// Add error message
const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!validEmailAddress.test(email)) {
  record.addError(
    'email',
    'This is not a valid email address.'
  )
}
```
#### 3. Warning Messages

```typescript
// Add warning message
if (!record.get('email')) {
  record.addWarning(
    'email',
    'Without an email, we will default to name for unique id.'
  )
}
```
### Common Use Cases

#### 1. Data Transformation

```typescript
listener.use(
  recordHook('orders', (record) => {
    // Convert price to number and format
    record.compute(
      'price',
      (value) => Number(value).toFixed(2),
      'Price formatted to 2 decimal places'
    )

    // Uppercase product codes
    record.computeIfPresent(
      'productCode',
      (code) => code.toUpperCase(),
      'Product code standardized to uppercase'
    )

    return record
  })
)
```
#### 2. Cross-field Validation

```typescript
listener.use(
  recordHook('shipping', (record) => {
    // Validate shipping details
    const country = record.get('country')
    const zipCode = record.get('zipCode')

    if (country === 'US' && !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      record.addError(
        'zipCode',
        'Invalid US ZIP code format'
      )
    }

    return record
  })
)
```
#### 3. Computed Fields

```typescript
listener.use(
  recordHook('invoices', (record) => {
    // Calculate total with tax
    record.compute(
      'total',
      (_, record) => {
        const subtotal = Number(record.get('subtotal'))
        const taxRate = Number(record.get('taxRate'))
        return (subtotal * (1 + taxRate)).toFixed(2)
      },
      'Total calculated including tax'
    )

    return record
  })
)
```
### Best Practices

1. **Performance**

```typescript
// Efficient data transformation
listener.use(
  recordHook('data', (record) => {
    // Process multiple fields in one pass
    const fields = ['field1', 'field2', 'field3']
    fields.forEach(field => {
      record.computeIfPresent(
        field,
        value => value.trim(),
        'Whitespace removed'
      )
    })
    return record
  })
)
```
2. **Error Handling**

```typescript
listener.use(
  recordHook('data', (record) => {
    try {
      // Complex transformation
      record.compute(
        'result',
        (value) => complexCalculation(value)
      )
    } catch (error) {
      record.addError(
        'result',
        `Calculation failed: ${error.message}`
      )
    }
    return record
  })
)
```

3. **Validation Chains**

```typescript
listener.use(
  recordHook('users', (record) => {
    const email = record.get('email')
    // Chain of validations
    if (!email) {
      record.addWarning('email', 'Email is recommended')
    } else if (!isValidEmail(email)) {
      record.addError('email', 'Invalid email format')
    } else if (isBlockedDomain(email)) {
      record.addError('email', 'Domain not allowed')
    } else {
      record.addInfo('email', 'Email validated successfully')
    }
    return record
  })
)
```
4. **Modular Hooks**

```typescript
// Separate concerns into different hooks
const validateAddressHook = recordHook('addresses', validateAddress)
const formatPhoneHook = recordHook('contacts', formatPhoneNumber)
const computeTotalsHook = recordHook('orders', computeTotals)

listener.use(validateAddressHook)
listener.use(formatPhoneHook)
listener.use(computeTotalsHook)
```
5. **Documentation**

```typescript
// Document complex transformations
listener.use(
  recordHook('data', (record) => {
    record.compute(
      'complexField',
      (value, record) => {
        // Document the transformation logic
        record.addInfo(
          'complexField',
          'Value calculated using Algorithm X with factors A, B, C'
        )
        return transformValue(value)
      }
    )
    return record
  })
)
```