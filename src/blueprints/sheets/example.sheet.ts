import type { Flatfile } from '@flatfile/api'

export const exampleSheet: Flatfile.SheetConfig = {
  name: 'Example Sheet',
  slug: 'example-sheet',
  fields: [
    {
      key: 'name',
      type: 'string',
      label: 'Name',
    },
    {
      key: 'email',
      type: 'string',
      label: 'Email',
    },
    {
      key: 'phone',
      type: 'string',
      label: 'Phone',
    },
    {
      key: 'dob',
      type: 'date',
      label: 'Date of Birth',
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
    },
    {
      key: 'gender',
      type: 'enum',
      label: 'Gender',
      config: {
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
      },
    },
    {
      key: 'favorite-colors',
      type: 'enum-list',
      label: 'Favorite Colors',
      description: 'Select your favorite colors. You can select multiple colors.',
      config: {
        options: [
          {
            value: 'red',
            label: 'Red',
          },
          {
            value: 'blue',
            label: 'Blue',
          },
          {
            value: 'green',
            label: 'Green',
          },
          {
            value: 'yellow',
            label: 'Yellow',
          },
        ],
      },
    },
  ],
}
