# Jobs


Jobs in Flatfile represent large units of work performed asynchronously on resources like files, Workbooks, or Sheets. They provide visibility into the status and progress of data processing operations.

### Types of Jobs

#### 1. Action Jobs
Jobs attached to custom actions defined in workbooks or sheets.

#### 2. Custom Jobs
Jobs created dynamically in your listener for custom operations.

#### 3. System Jobs
Built-in Flatfile jobs like extraction, mapping, and AI Assist.

### Action Based Jobs

Example of creating an action that generates a job:

    // 1. Create an action in a workbook
    const workbook: {
      name: "Data Import Workbook",
      actions: [
        {
          label: "Export Data",
          description: "Send data to destination system",
          operation: "export",
          type: "file"
        }
      ]
    };
    
    // 2. Listen for the job in your listener
    listener.on(
      "job:ready",
      { job: "workbook:export" },
      async ({ context: { jobId } }) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Starting export...",
            progress: 10
          });
    
          // Custom export logic here
    
          await api.jobs.complete(jobId, {
            outcome: {
              message: "Export completed successfully"
            }
          });
        } catch (error) {
          await api.jobs.fail(jobId, {
            outcome: {
              message: "Export failed"
            }
          });
        }
      }
    );
    

### Custom Jobs

Creating and handling custom jobs:

    // Create a custom job from an event
    listener.on(
      "commit:created",
      { sheet: "contacts" },
      async ({ context: { workbookId } }) => {
        const { data } = await api.jobs.create({
          type: "workbook",
          operation: "customOperation",
          trigger: "immediate",
          source: workbookId
        });
      }
    );
    
    // Handle the custom job
    listener.on(
      "job:ready",
      { job: "workbook:customOperation" },
      async ({ context: { jobId } }) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Starting custom operation",
            progress: 0
          });
    
          // Custom logic here
    
          await api.jobs.complete(jobId, {
            outcome: {
              message: "Operation completed"
            }
          });
        } catch (error) {
          await api.jobs.fail(jobId);
        }
      }
    );
    

### System Jobs

Common system jobs include:

    interface SystemJobs {
      Extract: "Extracts data from specified source",
      Map: "Maps data to Blueprint fields",
      DeleteRecords: "Deletes records based on criteria",
      Export: "Exports data to specified format",
      MutateRecords: "Alters records according to rules",
      Configure: "Modifies Space configuration",
      AiAssist: "AI-powered data categorization",
      FindReplace: "Search and replace operations"
    }
    

### Job Lifecycle

Jobs emit events in the following order:

1. `job:created` - Initial creation
2. `job:ready` - Ready for execution
3. `job:updated` - Progress updates
4. `job:completed` or `job:failed` - Final status
5. `job:outcome-acknowledged` - User acknowledgment

### Job Configuration

#### Required Parameters
    interface JobConfig {
      // Required
      type: "workbook" | "file" | "sheet" | "space";
      operation: string;  // e.g., "export", "extract", "map"
      source: string;     // Resource ID (workbookId, fileId, etc.)
    
      // Optional
      trigger?: "manual" | "immediate";
      destination?: string;
      status?: JobStatus;
      progress?: number;
      estimatedCompletionAt?: Date;
      mode?: "foreground" | "background" | "toolbarBlocking";
      metadata?: Record<string, any>;
    }
    
    type JobStatus = 
      | "created"
      | "planning"
      | "scheduled"
      | "ready"
      | "executing"
      | "complete"
      | "failed"
      | "cancelled";
    

### Working with Jobs

#### 1. Acknowledging Jobs
    await api.jobs.ack(jobId, {
      info: "Starting process...",
      progress: 0
    });
    

#### 2. Updating Progress
    await api.jobs.update(jobId, {
      progress: 50,
      estimatedCompletionAt: new Date("2024-01-01T12:00:00Z")
    });
    

#### 3. Completing Jobs with Outcomes

    // Basic completion
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Process completed successfully",
        acknowledge: true
      }
    });
    
    // With internal navigation
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Process completed",
        next: {
          type: "id",
          id: "space_id",
          path: "files",
          query: "mode=export",
          label: "View Files"
        }
      }
    });
    
    // With external URL
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Process completed",
        next: {
          type: "url",
          url: "https://example.com",
          label: "View Results"
        }
      }
    });
    
    // With file download
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Files ready",
        next: {
          type: "download",
          fileName: "export.csv",
          url: "file_url",
          label: "Download"
        }
      }
    });
    
    // With snapshot view
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Snapshot created",
        next: {
          type: "snapshot",
          snapshotId: "snapshot_id",
          sheetId: "sheet_id",
          label: "View Snapshot"
        }
      }
    });
    
    // With retry option
    await api.jobs.complete(jobId, {
      outcome: {
        message: "Process completed with warnings",
        next: {
          type: "retry",
          label: "Try Again"
        }
      }
    });
    

### Best Practices

1. **Error Handling**
          try {
         await processJob();
       } catch (error) {
         await api.jobs.fail(jobId, {
           outcome: {
             message: `Job failed: ${error.message}`,
             acknowledge: true
           }
         });
       }
       

2. **Progress Updates**
          function updateProgress(progress: number) {
         return api.jobs.update(jobId, {
           progress,
           info: `Processing: ${progress}% complete`
         });
       }
       

3. **User Feedback**
          await api.jobs.complete(jobId, {
         outcome: {
           heading: "Process Complete",
           message: "Detailed results...",
           buttonText: "Continue",
           acknowledge: true
         }
       });
       

4. **Resource Cleanup**
          listener.on("job:completed", async (event) => {
         const { jobId } = event.context;
         await cleanupTemporaryResources(jobId);
       });
       

5. **Job Monitoring**
          listener.use(async (event, next) => {
         if (event.topic.startsWith("job:")) {
           console.log(`Job ${event.context.jobId}: ${event.topic}`);
         }
         await next();
       });
       
