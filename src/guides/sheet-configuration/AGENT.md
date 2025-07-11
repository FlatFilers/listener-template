# Sheet Configuration


When creating a sheet configuration, use the following structure:

    import { Flatfile } from '@flatfile/api';
    
    export const MySheet = {
      name: 'My Sheet',
      slug: 'my_sheet',
      fields: [
        {
          key: 'fieldKey',
          type: 'string', // or 'number', 'boolean', etc.
          label: 'Field Label',
          description: 'Field description',
          constraints: [
            { type: 'required' },
            { type: 'external', validator: 'customValidator', config: { /* validation config */ } }
          ],
        },
        // Add more fields as needed
      ],
    };
    
