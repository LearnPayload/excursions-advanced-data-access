import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'category',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,

      hooks: {
        beforeValidate: [
          ({ siblingData, data }) => {
            let slug
            if (data && siblingData?.name && !siblingData?.slug) {
              slug = siblingData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return slug
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
