# Space Configuration Plugin


The `@flatfile/plugin-space-configure` plugin streamlines the setup of a new Flatfile Space. It's designed for server-side listeners and automatically configures the Space using the supplied settings.

### Installation

    npm install @flatfile/plugin-space-configure
    

### Usage

    import { configureSpace } from "@flatfile/plugin-space-configure";
    
    listener.use(
      configureSpace({
        workbooks: [  // Array of workbook configurations
          {
            name: "Workbook Name",
            sheets: [
              // Sheet configurations
            ],
            actions: [
              // Action configurations
            ],
          },
          // Additional workbooks...
        ]
      },
      // Document creation callback
      async (event: FlatfileEvent, workbookIds: string[], tick) => {
        // The event object contains the space information
        const spaceId = event.context.spaceId;
        const createDoc = await api.documents.create(spaceId, {
          title: "Getting Started",
          body: "Document content here"
        });
      })
    );
    

### Key Features

1. **Automatic Space Setup**: Configures the entire Space, including an array of workbooks, each with its own sheets and actions.
2. **Document Creation**: Documents are created through the callback function after space configuration.
3. **Progress Tracking**: The callback provides a tick function for progress updates.
4. **Type Safety**: Full TypeScript support with proper event typing.

### Best Practices

1. Use this plugin for initial Space setup in server-side listeners.
2. Keep workbook and sheet configurations in separate files for better organization.
3. Store document content in TypeScript constants for better maintainability.
4. Create documents in the callback function after space configuration.
5. Use proper TypeScript types for the callback parameters.
6. Consider using environment variables for dynamic configuration values.
