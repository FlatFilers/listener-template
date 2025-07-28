# Record Handling

## Overview

Working with records in Flatfile uses the `@flatfile/safe-api` package which provides powerful streaming capabilities and automatic pagination handling. This modern API eliminates manual pagination concerns and provides multiple data access patterns.

## Required Packages

```bash
bun install @flatfile/safe-api @flatfile/records
```

## Import Setup

```typescript
import api from '@flatfile/safe-api'
import { FlatfileRecord, Collection } from '@flatfile/records'
```

## Record Access Patterns

The safe-api provides four different methods for working with records:

### 1. Get All Records (Full Data)

For complete record access with metadata and change tracking:

```typescript
async function fetchAllRecords(sheetId: string): Promise<Collection<FlatfileRecord<any>>> {
  // Gets all records automatically, no pagination needed
  const records = await api.records.stream.get({ 
    sheetId,
    includeMetadata: true,
    includeConfig: true 
  })
  
  return records
}
```

### 2. Simple Records (Clean Data)

For simplified record access without internal metadata:

```typescript
async function fetchSimpleRecords(sheetId: string): Promise<any[]> {
  // Gets clean records without __k, __m prefixes
  const records = await api.records.stream.simple({ 
    sheetId 
  })
  
  return records
}
```

### 3. Streaming for Large Datasets

For memory-efficient processing of large datasets:

```typescript
async function processRecordsStreaming(
  sheetId: string,
  processor: (record: any) => Promise<void>,
  tick?: Function
): Promise<void> {
  let count = 0
  
  // Stream records one by one
  for await (const record of api.records.stream.simple({ 
    sheetId,
    stream: true 
  })) {
    await processor(record)
    count++
    
    if (tick && count % 1000 === 0) {
      await tick(null, `Processed ${count} records...`)
    }
  }
}
```

### 4. Collection-Based Streaming

For advanced record manipulation with change tracking:

```typescript
async function processCollections(
  sheetId: string,
  processor: (collection: Collection<FlatfileRecord<any>>) => Promise<void>,
  tick?: Function
): Promise<void> {
  let totalProcessed = 0
  
  // Stream collections of records
  for await (const collection of api.records.stream.get({ 
    sheetId,
    includeMetadata: true,
    stream: true 
  })) {
    await processor(collection)
    totalProcessed += collection.length
    
    if (tick) {
      await tick(null, `Processed ${totalProcessed} records...`)
    }
  }
}
```

## Record Updates and Changes

### Updating Records with Change Tracking

```typescript
async function updateRecords(sheetId: string, updates: any[]): Promise<void> {
  // Create collection with FlatfileRecord instances
  const collection = new Collection(
    updates.map(update => new FlatfileRecord(update))
  )

  // Make changes
  collection.each((record: FlatfileRecord<any>) => {
    // Modify record fields
    record.set('status', 'processed')
    record.set('updatedAt', new Date().toISOString())
  })

  // Update records with change tracking
  await api.records.stream.update(
    { 
      sheetId,
      truncate: false,
      snapshot: true
    },
    collection
  )

  // Commit changes after successful update
  const changes = collection.changes()
  changes.each((record: FlatfileRecord<any>) => record.commit())
}
```

### Raw Record Upsert

For bulk operations without change tracking:

```typescript
async function bulkUpsertRecords(sheetId: string, records: any[]): Promise<void> {
  await api.records.stream.raw(
    { 
      sheetId,
      truncate: false
    },
    records
  )
}
```

## Best Practices

### 1. Choose the Right Method

Select the appropriate method based on your use case:

```typescript
// ✅ For simple data access
const records = await api.records.stream.simple({ sheetId })

// ✅ For complex operations with change tracking
const collection = await api.records.stream.get({ sheetId, includeMetadata: true })

// ✅ For large datasets
for await (const record of api.records.stream.simple({ sheetId, stream: true })) {
  // Process one record at a time
}
```

### 2. Memory Management

Use streaming for large datasets to avoid memory issues:

```typescript
// ✅ Memory efficient for large datasets
for await (const collection of api.records.stream.get({ 
  sheetId, 
  stream: true 
})) {
  // Process each chunk independently
  await processCollection(collection)
}
```

### 3. Progress Tracking

Provide progress updates for long-running operations:

```typescript
// Update progress during streaming
await tick(null, `Processed ${totalRecords} records...`)
```

### 4. Error Handling and Retries

The safe-api includes built-in retry logic:

```typescript
// Configure retries globally
api.config.retryConfig = {
  retry: true,
  maxAttempts: 5,
  timeoutDelay: 500
}

// Or per request
const records = await api.records.stream.simple(
  { sheetId },
  { retry: true, maxAttempts: 3 }
)
```

## Common Use Cases

### 1. Data Analysis Jobs

```typescript
listener.use(
  jobHandler('sheet:analyze', async (event, tick) => {
    const { sheetId } = event.context
    
    await tick(10, 'Fetching all records...')
    const records = await api.records.stream.simple({ sheetId })
    
    await tick(60, 'Analyzing data...')
    const analysis = analyzeRecords(records)
    
    return { outcome: { message: 'Analysis complete' } }
  })
)
```

### 2. Bulk Operations with Streaming

```typescript
listener.use(
  jobHandler('sheet:transform', async (event, tick) => {
    const { sheetId } = event.context
    let totalProcessed = 0
    
    // Stream and process records in chunks
    for await (const collection of api.records.stream.get({ 
      sheetId, 
      includeMetadata: true,
      stream: true 
    })) {
      // Transform records
      collection.each((record: FlatfileRecord<any>) => {
        const value = record.get('status')
        record.set('status', value?.toUpperCase())
      })
      
      // Update the batch
      await api.records.stream.update(
        { sheetId, truncate: false },
        collection
      )
      
      totalProcessed += collection.length
      await tick(null, `Transformed ${totalProcessed} records...`)
    }
    
    return { outcome: { message: 'Transformation complete' } }
  })
)
```

### 3. Export Operations

```typescript
listener.use(
  jobHandler('sheet:export', async (event, tick) => {
    const { sheetId } = event.context
    
    await tick(20, 'Fetching records for export...')
    const allRecords = await api.records.stream.simple({ sheetId })
    
    await tick(80, 'Generating export file...')
    const exportData = formatForExport(allRecords)
    
    return { 
      outcome: { 
        message: `Exported ${allRecords.length} records`,
        next: { type: 'download', url: exportUrl }
      } 
    }
  })
)
```

### 4. Deduplication Example

```typescript
listener.use(
  jobHandler('sheet:dedupe', async (event, tick) => {
    const { sheetId } = event.context
    const { matchFields, keepStrategy } = event.payload.input || {}

    await tick(10, 'Fetching all records...')
    const records = await api.records.stream.simple({ sheetId })
    
    await tick(30, 'Finding duplicates...')
    const duplicateGroups = findDuplicates(records, matchFields)
    
    if (duplicateGroups.length === 0) {
      return {
        outcome: { message: 'No duplicates found', acknowledge: true }
      }
    }

    await tick(50, `Found ${duplicateGroups.length} duplicate groups`)
    
    // Select records to keep/delete based on strategy
    const toDelete = []
    for (const group of duplicateGroups) {
      const recordsToDelete = selectRecordsToDelete(group, keepStrategy)
      toDelete.push(...recordsToDelete)
    }

    await tick(80, `Removing ${toDelete.length} duplicate records...`)
    
    // Delete records using the API
    for (const recordId of toDelete) {
      await api.records.delete(sheetId, recordId)
    }

    return {
      outcome: {
        message: `Removed ${toDelete.length} duplicate records from ${duplicateGroups.length} groups`,
        acknowledge: true
      }
    }
  })
)
```

## Error Handling

The `@flatfile/safe-api` includes built-in error handling and retry logic:

```typescript
try {
  // Configure retries for this operation
  const records = await api.records.stream.simple(
    { sheetId },
    { 
      retry: true, 
      maxAttempts: 5,
      timeoutDelay: 1000
    }
  )
  
  // Process records
  await processRecords(records)
  
} catch (error) {
  console.error('Record operation failed:', error)
  
  // Handle specific error types
  if (error.name === 'RetryError') {
    console.error('Max retry attempts exceeded')
  } else if (error.status === 404) {
    console.error('Sheet not found')
  } else if (error.status === 429) {
    console.error('Rate limit exceeded')
  }
  
  throw error
}
```
