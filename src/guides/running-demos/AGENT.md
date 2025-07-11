# Running Demos


To run a specific demo, use the following command:

    npm run dev <demo-name>
    

For example, to run the fishbowl-inventories demo:

    npm run dev fishbowl-inventories
    

### Environment Variables

Before running a demo, ensure that you have the following environment variables set in your local `.env` file, which should be located in the demo directory root:

- `FLATFILE_API_KEY`: Your Flatfile API key
- `FLATFILE_ENVIRONMENT_ID`: Your Flatfile environment ID

Example `.env` file:

    FLATFILE_API_KEY=your_api_key_here
    FLATFILE_ENVIRONMENT_ID=your_environment_id_here 
    
