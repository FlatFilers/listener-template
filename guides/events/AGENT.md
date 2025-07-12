# Events


### Overview

Flatfile provides a comprehensive event system that allows you to respond to various activities within the platform. The platform offers both a REST API for direct resource manipulation and an Event bus for subscribing to resource-related notifications. The Flatfile PubSub Client serves as a lightweight wrapper around the API, making it easy to trigger API calls in response to Events.

### Event Structure

Events in Flatfile follow a standardized structure:

```typescript
interface FlatfileEvent {
  domain: string      // The domain of the event (e.g., 'workbook', 'sheet')
  topic: string       // The specific event type (e.g., 'workbook:created')
  context: {
    accountId: string
    environmentId: string
    spaceId?: string
    workbookId?: string
    actorId: string
    [key: string]: any
  }
  payload?: any       // Optional event-specific data
}
```
### Using Events

Events can be handled using the `@flatfile/listener` library:

```typescript
import { FlatfileListener } from '@flatfile/listener'

const listener = new FlatfileListener()

listener.on(
  'job:ready',                    // Event topic
  { job: 'space:configure' },     // Event filter
  async (event: FlatfileEvent) => {
    // Handle the event
    console.log('Job ready:', event)
  }
)
```
### Event Topics

#### Workbook Events

```typescript
// Workbook created
listener.on('workbook:created', async (event) => {
  const { workbookId, spaceId } = event.context
  // Handle new workbook
})

// Workbook updated
listener.on('workbook:updated', async (event) => {
  // Triggered when workbook metadata changes
})

// Workbook deleted
listener.on('workbook:deleted', async (event) => {
  // Clean up after workbook deletion
})

// Workbook expired
listener.on('workbook:expired', async (event) => {
  // Handle workbook expiration
})
```
#### Sheet Events

```typescript
// Sheet updated
listener.on('sheet:updated', async (event) => {
  const { sheetId, sheetSlug } = event.context
  // Handle sheet updates (e.g., validations)
})

// Sheet deleted
listener.on('sheet:deleted', async (event) => {
  // Handle sheet deletion
})

// Snapshot created
listener.on('snapshot:created', async (event) => {
  // Handle new sheet snapshot
})
```

#### Record Events

```typescript
// Commit created
listener.on('commit:created', async (event) => {
  // Handle new record changes
})

// Commit completed
listener.on('commit:completed', async (event) => {
  // Handle completed record changes
  // Only fires when trackChanges is enabled
})

// Layer created
listener.on('layer:created', async (event) => {
  // Handle new layer in a commit
})
```
#### File Events

```typescript
// File created
listener.on('file:created', async (event) => {
  const { fileId } = event.context
  // Handle new file upload
})

// File updated
listener.on('file:updated', async (event) => {
  const { status, workbookId } = event.payload
  // Handle file extraction completion
})

// File deleted/expired
listener.on('file:deleted', async (event) => {
  // Clean up after file deletion
})
```
#### Job Events

```typescript
// Job created
listener.on('job:created', async (event) => {
  const { job, status } = event.payload
  // Handle new job creation
})

// Job ready
listener.on('job:ready', async (event) => {
  // Handle job ready to execute
})

// Job completed
listener.on('job:completed', async (event) => {
  // Handle job completion
})

// Job failed
listener.on('job:failed', async (event) => {
  // Handle job failure
})
```
#### Space Events

```typescript
// Space lifecycle events
listener.on('space:created', async (event) => {
  // Handle new space
})

listener.on('space:updated', async (event) => {
  // Handle space updates
})

// Guest management
listener.on('space:guestAdded', async (event) => {
  // Handle new guest access
})

listener.on('space:guestRemoved', async (event) => {
  // Handle guest removal
})
```
### Best Practices for Event Handling

1. **Error Handling**

```typescript
listener.on('job:ready', async (event) => {
  try {
    // Handle event
  } catch (error) {
    console.error('Event handling failed:', error)
    // Proper error reporting
  }
})
```
2. **Event Filtering**

```typescript
// Filter events by specific criteria
listener.on('commit:created', 
  { sheet: 'contacts' },  // Only handle events for 'contacts' sheet
  async (event) => {
    // Handle filtered events
  }
)
```
3. **Async Operations**

```typescript
listener.on('workbook:created', async (event) => {
  // Use async/await for asynchronous operations
  await processWorkbook(event.context.workbookId)
})
```
4. **Context Utilization**

```typescript
listener.on('sheet:updated', async (event) => {
  const {
    accountId,
    environmentId,
    spaceId,
    workbookId,
    sheetId,
    sheetSlug
  } = event.context
  
  // Use context information for processing
})
```
5. **Event Chaining**

```typescript
// Handle related events in sequence
listener.use(async (event, next) => {
  if (event.topic === 'file:created') {
    // Pre-process file
  }
  await next()
  // Post-process
})
```