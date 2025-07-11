# Field Types


Flatfile supports various field types to handle different kinds of data:

### String
    {
      key: "fieldName",
      type: "string",
      label: "Field Label",
      description: "Field description",
      constraints: [
        { type: "required" },
        { type: "external", validator: "length", config: { max: 100 } }
      ]
    }
    

### Number
    {
      key: "price",
      type: "number",
      label: "Price",
      description: "Product price",
      config: {
        decimal_places: 2
      }
    }
    

### Enum
    {
      key: "status",
      type: "enum",
      label: "Status",
      description: "Item status",
      config: {
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" }
        ]
      }
    }
    

### Reference
    {
      key: "parentId",
      type: "reference",
      label: "Parent Record",
      description: "Reference to parent record",
      config: {
        ref: "parent-sheet",
        key: "id",
        relationship: "has-one"
      }
    }
    

### Boolean
    {
      key: "isActive",
      type: "boolean",
      label: "Active Status",
      description: "Whether the item is active"
    }
    

### Date
    {
      key: "createdAt",
      type: "date",
      label: "Created Date",
      description: "Record creation date"
    }
    
