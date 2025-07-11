# Blueprint Overview


Blueprint is your guide to structuring data in Flatfile. It defines how your data should look, behave, and connect—from simple field validations to complex relationships between datasets. Think of it as a smart schema that helps you collect exactly the data you need, in exactly the format you want it.

### Basic Structure

    /**
     * @FlatfileConstraints
     */
    export const sheetName: Flatfile.SheetConfig = {
      name: "Sheet Name",
      slug: "sheet-slug",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        // Field definitions go here
      ]
    };
    
