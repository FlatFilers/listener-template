# Workbook Configuration


When creating a workbook configuration, use the following structure:

```typescript
import { MySheet } from './sheets/my-sheet'

const workbook = {
  name: 'My Workbook',
  sheets: [MySheet],
  actions: [],
}

export default workbook
```