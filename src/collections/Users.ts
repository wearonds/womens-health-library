import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users', auth: true,
  admin: { useAsTitle: 'name' },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'ชื่อที่แสดง' },
    { name: 'role', type: 'select', required: true, defaultValue: 'author', options: ['admin', 'author', 'reviewer', 'publisher'], access: { update: ({ req }) => req.user?.role === 'admin' } },
  ],
  hooks: { beforeChange: [({ data, operation, req }) => {
    if (operation === 'create' && !req.user) data.role = 'admin' // Payload's first-user endpoint only.
    else if (operation === 'create' && req.user?.role !== 'admin') data.role = 'author'
    return data
  }] },
}
