import type { CollectionConfig } from 'payload'
export const Media: CollectionConfig = {
  slug: 'media',
  upload: { staticDir: 'media', mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], imageSizes: [{ name: 'article', width: 960 }] },
  access: { read: ({ req }) => Boolean(req.user), create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => req.user?.role === 'admin' },
  fields: [{ name: 'alt', type: 'text', required: true }, { name: 'caption', type: 'text' }],
}
