# Examples


### Basic Sheet Configuration

```typescript
export const Products: Flatfile.SheetConfig = {
  name: 'Products',
  slug: 'products',
  fields: [
    {
      key: 'sku',
      type: 'string',
      label: 'SKU',
      description: 'Unique product identifier',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { max: 50 } }
      ]
    },
    {
      key: 'name',
      type: 'string',
      label: 'Product Name',
      description: 'Name of the product',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { max: 100 } }
      ]
    },
    {
      key: 'price',
      type: 'number',
      label: 'Price',
      description: 'Product price',
      config: {
        decimalPlaces: 2
      },
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'range', config: { min: 0 } }
      ]
    },
    {
      key: 'status',
      type: 'enum',
      label: 'Status',
      description: 'Product status',
      config: {
        options: [
          { value: 'active', label: 'Active' },
          { value: 'discontinued', label: 'Discontinued' },
          { value: 'out_of_stock', label: 'Out of Stock' }
        ]
      }
    }
  ]
}
```
### Sheet with References and Constraints

```typescript
export const OrderLines: Flatfile.SheetConfig = {
  name: 'Order Lines',
  slug: 'order-lines',
  fields: [
    {
      key: 'orderId',
      type: 'reference',
      label: 'Order ID',
      description: 'Reference to the parent order',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'exists', config: { sheet: 'orders' } }
      ],
      config: {
        ref: 'orders',
        key: 'id',
        relationship: 'has-one'
      }
    },
    {
      key: 'productSku',
      type: 'reference',
      label: 'Product SKU',
      description: 'Reference to the product',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'exists', config: { sheet: 'products' } }
      ],
      config: {
        ref: 'products',
        key: 'sku',
        relationship: 'has-one'
      }
    },
    {
      key: 'quantity',
      type: 'number',
      label: 'Quantity',
      description: 'Order line quantity',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'range', config: { min: 1 } }
      ]
    },
    {
      key: 'unitPrice',
      type: 'number',
      label: 'Unit Price',
      description: 'Price per unit',
      config: {
        decimalPlaces: 2
      },
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'range', config: { min: 0 } }
      ]
    }
  ]
}
```

### Index File

```typescript
import { Products } from './products'
import { Orders } from './orders'
import { OrderLines } from './order-lines'

export {
  Products,
  Orders,
  OrderLines
}
```