# Listeners


### Entry Point and Configuration

Every Flatfile project must start with a default export function that takes a listener parameter. This is the entry point for all Flatfile configurations and event handling:

```typescript
export default function(listener) {
  // All listener configurations go here
}
```
This function is where you:
1. Configure event handlers
2. Set up workbook configurations
3. Define space configurations
4. Implement data transformations
5. Handle job processing

Here's a complete example showing the standard setup:

```typescript
import api from '@flatfile/api'

export default function(listener) {
  // Global event logging
  listener.on('**', (event) => {
    console.log(`Received event: ${event.topic}`)
  })

  // Space configuration with namespace
  listener.namespace(['space:red'], (red) => {
    red.on(
      'job:ready',
      { job: 'space:configure' },
      async ({ context: { spaceId, environmentId, jobId } }) => {
        try {
          // Acknowledge job start
          await api.jobs.ack(jobId, {
            info: 'Getting started.',
            progress: 10,
          })

          // Create workbook with sheets and actions
          await api.workbooks.create({
            spaceId,
            environmentId,
            name: 'All Data',
            sheets: [
              {
                name: 'Contacts',
                slug: 'contacts',
                fields: [
                  {
                    key: 'firstName',
                    type: 'string',
                    label: 'First Name',
                  },
                  {
                    key: 'lastName',
                    type: 'string',
                    label: 'Last Name',
                  },
                  {
                    key: 'email',
                    type: 'string',
                    label: 'Email',
                  },
                ],
              },
            ],
            actions: [
              {
                operation: 'submitAction',
                mode: 'foreground',
                label: 'Submit foreground',
                description: 'Submit data to webhook.site',
                primary: true,
              },
            ],
          })

          // Create welcome document
          await api.documents.create(spaceId, {
            title: 'Getting Started',
            body: '# Welcome\n' +
                  '### Say hello to your first customer Space in the new Flatfile!\n' +
                  'Let's begin by first getting acquainted with what you're seeing in your Space initially.\n' +
                  '---\n',
          })

          // Configure space theme
          await api.spaces.update(spaceId, {
            environmentId,
            metadata: {
              theme: {
                root: {
                  primaryColor: 'red',
                },
                sidebar: {
                  backgroundColor: 'red',
                  textColor: 'white',
                  activeTextColor: 'midnightblue',
                },
              },
            },
          })

          // Complete job
          await api.jobs.complete(jobId, {
            outcome: {
              message: 'Your Space was created.',
              acknowledge: true,
            },
          })
        } catch (error) {
          console.error('Error:', error.stack)

          // Handle job failure
          await api.jobs.fail(jobId, {
            outcome: {
              message: 'Creating a Space encountered an error. See Event Logs.',
              acknowledge: true,
            },
          })
        }
      },
    )
  })
}
```
This setup demonstrates:
- Global event logging
- Namespace configuration
- Workbook creation with sheets and actions
- Document creation
- Space theme customization
- Error handling and job management

### Overview

Listeners are the core of the Flatfile Platform, handling all configurations from data transformations to custom styling and data export. They define the functionality of your Flatfile implementation by responding to Events.

### Event Structure

```typescript
interface FlatfileEvent {
  domain: string    // e.g., record, sheet, workbook, space
  topic: string     // e.g., workbook:created, sheet:updated
  context: {
    spaceId: string
    fileId?: string
    // Additional context
  }
  payload?: any     // Optional execution details
}
```
### Basic Listener Implementation

```typescript
export default function(listener) {
  // Listen to all events
  listener.on('**', (event) => {
    console.log(`Received event: ${event.topic}`)
  })

  // Listen to specific events
  listener.on('commit:created', async (event) => {
    // Handle commit creation
  })
}
```
### Event Filtering

#### Simple Filter
```typescript
export default function(listener) {
  listener.on('commit:created', { sheet: 'contacts' }, async (event) => {
    // Handle commit for contacts sheet
  })
}
```

#### Multiple Listeners Under One Filter
```typescript
export default function(listener) {
  listener.filter({ sheet: 'contacts' }, (configure) => {
    configure.on('commit:created', async (event) => {
      // Handle new commits
    })

    configure.on('commit:completed', async (event) => {
      // Handle completed commits
    })
  })
}
```

### Namespaces

Namespaces help organize different workflows and target specific events:

```typescript
export default function(listener) {
  // Configure listeners for different namespaces
  listener.namespace(['space:green'], (listener) => {
    listener.on('commit:created', async (event) => {
      // Handle green space commits
    })
  })
  
  listener.namespace(['space:red'], (listener) => {
    listener.on('commit:created', async (event) => {
      // Handle red space commits
    })
  })
}
```   

### Agent Management

#### Conflict Prevention
1. **Event Filtering**
```typescript
export default function(listener) {
  // Agent 1: Handles only contact-related events
  listener.filter({ sheet: 'contacts' }, (configure) => {
    // Contact-specific handlers
  })
    // Agent 2: Handles only order-related events
  listener.filter({ sheet: 'orders' }, (configure) => {
    // Order-specific handlers
  })
}
```

2. **Namespace Isolation**
```typescript
export default function(listener) {
  // Agent 1: Handles data validation
  listener.namespace(['validation'], (listener) => {
    // Validation logic
  })
  
  // Agent 2: Handles data export
  listener.namespace(['export'], (listener) => {
    // Export logic
  })
}
```
### Error Handling

```typescript
export default function(listener) {
  listener.on('**', async (event) => {
    try {
      await processEvent(event)
    } catch (error) {
      // Handle error
      console.error(`Error processing event: ${error.message}`)
        // Optional: Re-throw to mark as failure
      throw error
    }
  })
}
```

### Best Practices

1. **Event Handling**
```typescript
export default function(listener) {
  // Use specific event handlers
  listener.on('commit:created', async (event) => {
    const { workbookId, sheetId } = event.context
    // Handle specific event
  })
  
  // Avoid wildcard handlers unless necessary
  listener.on('**', async (event) => {
    // Generic handler
  })
}
```

2. **Error Management**
```typescript
export default function(listener) {
  function createErrorHandler(eventType: string) {
    return async (error: Error) => {
      console.error(`Error in ${eventType}:`, error)
      await notifyAdmins(error)
      // Additional error handling
    }
  }
  
  listener.on('commit:created', async (event) => {
    try {
      await processCommit(event)
    } catch (error) {
      await createErrorHandler('commit:created')(error)
    }
  })
}
```
3. **Performance Optimization**
```typescript
export default function(listener) {
  // Use efficient filtering
  listener.filter(
    { sheet: 'contacts', status: 'valid' },
    async (event) => {
      // Process only valid contact records
    }
  )
  
  // Implement debouncing for frequent events
  const debouncedHandler = debounce(async (event) => {
    await processEvent(event)
  }, 1000)
  
  listener.on('record:updated', debouncedHandler)
}
```
4. **Logging and Monitoring**
```typescript
export default function(listener) {
  listener.use(async (event, next) => {
    const startTime = Date.now()
    try {
      await next()
    } finally {
      const duration = Date.now() - startTime
      console.log(`Event ${event.topic} processed in ${duration}ms`)
    }
  })
}
```
5. **Resource Management**
```typescript
export default function(listener) {
  listener.on('workbook:created', async (event) => {
    const resources = await allocateResources()
    try {
      await processWorkbook(event, resources)
    } finally {
      await releaseResources(resources)
    }
  })
}
```