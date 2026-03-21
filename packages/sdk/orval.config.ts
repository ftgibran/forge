import { defineConfig } from 'orval'

export default defineConfig({
  forge: {
    input: {
      target: '../../apps/api/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated',
      schemas: './src/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/client/mutator.ts',
          name: 'apiMutator',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
})
