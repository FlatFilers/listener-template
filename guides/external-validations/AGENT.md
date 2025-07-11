# External Validations


To use custom validations, you need to set up the external validations plugin:

1. Install the plugin:
          npm install @flatfile/plugin-constraints
       

2. Create a `validations.ts` file in your `/hooks` directory:
          import { externalConstraint } from '@flatfile/plugin-constraints';
    
       export const maxLengthValidator = externalConstraint("maxLength", (value, key, { config, record }) => {
         if (value.length > config.max) {
           record.addError(key, `Value must be no more than ${config.max} characters long`);
         }
       });
    
       export const minValueValidator = externalConstraint("minValue", (value, key, { config, record }) => {
         const numValue = Number(value);
         if (isNaN(numValue) || numValue < config.min) {
           record.addError(key, `Value must be a number at least ${config.min}`);
         } else {
           record.set(key, numValue);
         }
       });
       

3. In your main `index.ts` file, import and use these validations:
          import { FlatfileListener } from '@flatfile/listener';
       import { maxLengthValidator, minValueValidator } from './hooks/validations';
    
       export default function flatfileEventListener(listener: FlatfileListener) {
         listener.use(maxLengthValidator);
         listener.use(minValueValidator);
    
         // ... rest of your listener configuration
       }
       

4. Use these custom validations in your sheet configurations:
          {
         key: 'fieldName',
         type: 'string',
         constraints: [
           { type: 'external', validator: 'maxLength', config: { max: 100 } }
         ]
       }
       

This setup allows you to define reusable validation functions and apply them across your Flatfile configuration. The validation functions can modify the record directly using methods like `addError`, `addWarning`, `addInfo`, and `set`. This provides more flexibility in handling different validation scenarios and updating the record as needed.
