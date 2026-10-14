import * as migration_20261014_122201_initial_schema from './20261014_122201_initial_schema';
import * as migration_20261014_155855_approval_category from './20261014_155855_approval_category';

export const migrations = [
  {
    up: migration_20261014_122201_initial_schema.up,
    down: migration_20261014_122201_initial_schema.down,
    name: '20261014_122201_initial_schema',
  },
  {
    up: migration_20261014_155855_approval_category.up,
    down: migration_20261014_155855_approval_category.down,
    name: '20261014_155855_approval_category'
  },
];
