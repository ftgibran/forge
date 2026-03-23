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
          path: './src/http/request.ts',
          name: 'httpRequest',
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
