# Listeners


### Entry Point and Configuration

Every Flatfile project must start with a default export function that takes a listener parameter. This is the entry point for all Flatfile configurations and event handling:

    export default function flatfileEventListener(listener) {
      // All listener configurations go here
    }
    

This function is where you:
1. Configure event handlers
2. Set up workbook configurations
3. Define space configurations
4. Implement data transformations
5. Handle job processing

Here's a complete example showing the standard setup:

    import api from "@flatfile/api";
    
    export default function flatfileEventListener(listener) {
      // Global event logging
      listener.on("**", (event) => {
        console.log(`Received event: ${event.topic}`);
      });
    
      // Space configuration with namespace
      listener.namespace(["space:red"], (red) => {
        red.on(
          "job:ready",
          { job: "space:configure" },
          async ({ context: { spaceId, environmentId, jobId } }) => {
            try {
              // Acknowledge job start
              await api.jobs.ack(jobId, {
                info: "Getting started.",
                progress: 10,
              });
    
              // Create workbook with sheets and actions
              await api.workbooks.create({
                spaceId,
                environmentId,
                name: "All Data",
                labels: ["pinned"],
                sheets: [
                  {
                    name: "Contacts",
                    slug: "contacts",
                    fields: [
                      {
                        key: "firstName",
                        type: "string",
                        label: "First Name",
                      },
                      {
                        key: "lastName",
                        type: "string",
                        label: "Last Name",
                      },
                      {
                        key: "email",
                        type: "string",
                        label: "Email",
                      },
                    ],
                  },
                ],
                actions: [
                  {
                    operation: "submitAction",
                    mode: "foreground",
                    label: "Submit foreground",
                    description: "Submit data to webhook.site",
                    primary: true,
                  },
                ],
              });
    
              // Create welcome document
              await api.documents.create(spaceId, {
                title: "Getting Started",
                body: "# Welcome\n" +
                      "### Say hello to your first customer Space in the new Flatfile!\n" +
                      "Let's begin by first getting acquainted with what you're seeing in your Space initially.\n" +
                      "---\n",
              });
    
              // Configure space theme
              await api.spaces.update(spaceId, {
                environmentId,
                metadata: {
                  theme: {
                    root: {
                      primaryColor: "red",
                    },
                    sidebar: {
                      backgroundColor: "red",
                      textColor: "white",
                      activeTextColor: "midnightblue",
                    },
                  },
                },
              });
    
              // Complete job
              await api.jobs.complete(jobId, {
                outcome: {
                  message: "Your Space was created.",
                  acknowledge: true,
                },
              });
            } catch (error) {
              console.error("Error:", error.stack);
    
              // Handle job failure
              await api.jobs.fail(jobId, {
                outcome: {
                  message: "Creating a Space encountered an error. See Event Logs.",
                  acknowledge: true,
                },
              });
            }
          },
        );
      });
    }
    

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

    interface FlatfileEvent {
      domain: string;    // e.g., record, sheet, workbook, space
      topic: string;     // e.g., workbook:created, sheet:updated
      context: {
        spaceId: string;
        fileId?: string;
        // Additional context
      };
      payload?: any;     // Optional execution details
    }
    

### Basic Listener Implementation

    export default function(listener) {
      // Listen to all events
      listener.on("**", (event) => {
        console.log(`Received event: ${event.topic}`);
      });
    
      // Listen to specific events
      listener.on("commit:created", async (event) => {
        // Handle commit creation
      });
    }
    

### Event Filtering

#### Simple Filter
    // Using shorthand syntax
    listener.on("commit:created", { sheet: "contacts" }, async (event) => {
      // Handle commit for contacts sheet
    });
    
    // Using filter method
    listener.filter({ sheet: "contacts" }).on("commit:created", async (event) => {
      // Handle commit for contacts sheet
    });
    

#### Multiple Listeners Under One Filter
    export default function(listener) {
      listener.filter({ sheet: "contacts" }, (configure) => {
        configure.on("commit:created", async (event) => {
          // Handle new commits
        });
    
        configure.on("commit:completed", async (event) => {
          // Handle completed commits
        });
      });
    }
    

### Namespaces

Namespaces help organize different workflows and target specific events:

    // Configure listeners for different namespaces
    listener.namespace(['space:green'], (listener) => {
      listener.on("commit:created", async (event) => {
        // Handle green space commits
      });
    });
    
    listener.namespace(['space:red'], (listener) => {
      listener.on("commit:created", async (event) => {
        // Handle red space commits
      });
    });
    

### Listener Types

#### 1. Development Listener
- Location: Developer machine
- Use: Local development and testing

#### 2. Client-side Listener
- Location: User's browser
- Use: Browser-specific operations
- Example:
    // Access browser-specific values
    listener.on("workbook:created", async (event) => {
      const currentUrl = window.location.href;
      const userSession = getCurrentSession();
      // Handle browser-specific logic
    });
    

#### 3. Agent (Server-side on Flatfile)
- Location: Flatfile's secure cloud
- Use: Complex operations, external integrations
- Example:
    // Complex data processing
    listener.on("commit:created", async (event) => {
      await processLargeDataset(event.payload);
      await integrateWithExternalSystem(event.context);
    });
    

#### 4. Server-side Listener
- Location: Your secure server
- Use: Self-hosted operations
- Example:
    // Integration with internal systems
    listener.on("workbook:created", async (event) => {
      await yourInternalAPI.process(event);
    });
    

### Agent Management

#### Deployment
    # Deploy with default slug
    npx flatfile@latest deploy
    
    # Deploy with custom slug
    npx flatfile@latest deploy -s custom-agent-name
    

#### Conflict Prevention
1. **Event Filtering**
    // Agent 1: Handles only contact-related events
    listener.filter({ sheet: "contacts" }, (configure) => {
      // Contact-specific handlers
    });
    
    // Agent 2: Handles only order-related events
    listener.filter({ sheet: "orders" }, (configure) => {
      // Order-specific handlers
    });
    

2. **Namespace Isolation**
    // Agent 1: Handles data validation
    listener.namespace(['validation'], (listener) => {
      // Validation logic
    });
    
    // Agent 2: Handles data export
    listener.namespace(['export'], (listener) => {
      // Export logic
    });
    

### Error Handling

    export default function(listener) {
      listener.on("**", async (event) => {
        try {
          await processEvent(event);
        } catch (error) {
          // Handle error
          console.error(`Error processing event: ${error.message}`);
          
          // Optional: Re-throw to mark as failure
          throw error;
        }
      });
    }
    

### Best Practices

1. **Event Handling**
    // Use specific event handlers
    listener.on("commit:created", async (event) => {
      const { workbookId, sheetId } = event.context;
      // Handle specific event
    });
    
    // Avoid wildcard handlers unless necessary
    listener.on("**", async (event) => {
      // Generic handler
    });
    

2. **Error Management**
    function createErrorHandler(eventType: string) {
      return async (error: Error) => {
        console.error(`Error in ${eventType}:`, error);
        await notifyAdmins(error);
        // Additional error handling
      };
    }
    
    listener.on("commit:created", async (event) => {
      try {
        await processCommit(event);
      } catch (error) {
        await createErrorHandler("commit:created")(error);
      }
    });
    

3. **Performance Optimization**
    // Use efficient filtering
    listener.filter(
      { sheet: "contacts", status: "valid" },
      async (event) => {
        // Process only valid contact records
      }
    );
    
    // Implement debouncing for frequent events
    const debouncedHandler = debounce(async (event) => {
      await processEvent(event);
    }, 1000);
    
    listener.on("record:updated", debouncedHandler);
    

4. **Logging and Monitoring**
    listener.use(async (event, next) => {
      const startTime = Date.now();
      
      try {
        await next();
      } finally {
        const duration = Date.now() - startTime;
        console.log(`Event ${event.topic} processed in ${duration}ms`);
      }
    });
    

5. **Resource Management**
    listener.on("workbook:created", async (event) => {
      const resources = await allocateResources();
      
      try {
        await processWorkbook(event, resources);
      } finally {
        await releaseResources(resources);
      }
    });
    
