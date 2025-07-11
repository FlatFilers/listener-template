# Best Practices


1. **File Organization**
   - One sheet per file
   - Use descriptive file names
   - Export all sheets through an index file

2. **Naming Conventions**
   - Use PascalCase for sheet names
   - Use camelCase for field keys
   - Use kebab-case for slugs

3. **Documentation**
   - Always include field descriptions
   - Use JSDoc comments for sheet configurations
   - Document any special validation rules

4. **Validation**
   - Use the external constraints plugin for custom validation
   - Keep validation logic modular and reusable
   - Provide clear error messages
   - Handle edge cases appropriately

5. **References**
   - Use reference fields to maintain data relationships
   - Ensure referenced fields are unique
   - Document relationship requirements
