# Workbook Configuration


When creating a workbook configuration, use the following structure:

    import { MySheet } from './sheets/my-sheet';
    
    const workbook = {
      name: 'My Workbook',
      labels: ['pinned'],
      sheets: [MySheet],
      actions: [],
    };
    
    export default workbook;
    
