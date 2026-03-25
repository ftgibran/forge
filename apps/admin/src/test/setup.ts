import '@testing-library/jest-dom/vitest'

import React from 'react'
import { vi } from 'vitest'

// Mock @chakra-ui/react — spread all real exports, override only what needs stubbing
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()

  const make =
    (tag: string) =>
    ({
      children,
      ...props
    }: {
      children?: React.ReactNode
      [key: string]: unknown
    }) => {
      const filtered: Record<string, unknown> = {}

      for (const [k, v] of Object.entries(props)) {
        if (
          typeof v === 'string' ||
          typeof v === 'number' ||
          typeof v === 'boolean'
        ) {
          filtered[k] = v
        }
      }

      return React.createElement(tag, filtered, children)
    }

  const TableSub =
    (tag: string) =>
    ({ children }: { children?: React.ReactNode; [key: string]: unknown }) =>
      React.createElement(tag, {}, children)

  const Table = TableSub('table') as ReturnType<typeof TableSub> & {
    Root: ReturnType<typeof TableSub>
    Header: ReturnType<typeof TableSub>
    Body: ReturnType<typeof TableSub>
    Row: ReturnType<typeof TableSub>
    ColumnHeader: ReturnType<typeof TableSub>
    Cell: ReturnType<typeof TableSub>
  }

  Table.Root = TableSub('table')
  Table.Header = TableSub('thead')
  Table.Body = TableSub('tbody')
  Table.Row = TableSub('tr')
  Table.ColumnHeader = TableSub('th')
  Table.Cell = TableSub('td')

  return {
    ...actual,
    Box: make('div'),
    Flex: make('div'),
    HStack: make('div'),
    VStack: make('div'),
    Stack: make('div'),
    Heading: ({
      children,
    }: {
      children?: React.ReactNode
      [key: string]: unknown
    }) => React.createElement('h2', { role: 'heading' }, children),
    Text: make('span'),
    Button: ({
      children,
      onClick,
      disabled,
    }: {
      children?: React.ReactNode
      onClick?: () => void
      disabled?: boolean
      [key: string]: unknown
    }) => React.createElement('button', { onClick, disabled }, children),
    Icon: make('span'),
    Badge: make('span'),
    Image: (props: { src?: string; alt?: string; [key: string]: unknown }) =>
      React.createElement('img', { src: props.src, alt: props.alt }),
    Input: (props: { [key: string]: unknown }) =>
      React.createElement(
        'input',
        props as React.InputHTMLAttributes<HTMLInputElement>,
      ),
    Textarea: (props: { [key: string]: unknown }) =>
      React.createElement(
        'textarea',
        props as React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      ),
    Card: {
      Root: make('div'),
      Body: make('div'),
      Header: make('div'),
      Footer: make('div'),
    },
    Table,
    Avatar: make('div'),
    Spinner: () => React.createElement('div', { 'aria-label': 'loading' }),
    Separator: make('hr'),
    SimpleGrid: make('div'),
    IconButton: ({
      children,
      onClick,
      'aria-label': ariaLabel,
    }: {
      children?: React.ReactNode
      onClick?: () => void
      'aria-label'?: string
      [key: string]: unknown
    }) =>
      React.createElement(
        'button',
        { onClick, 'aria-label': ariaLabel },
        children,
      ),
    For: ({
      each,
      children,
    }: {
      each: unknown[]
      children: (item: unknown, index: number) => React.ReactNode
    }) =>
      React.createElement(
        React.Fragment,
        {},
        each.map((item, i) => children(item, i)),
      ),
    createListCollection: (opts: { items: unknown[] }) => ({
      items: opts.items,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defineStyle: (styles: any) => styles,
    useRecipe: vi.fn(() => ({})),
    useSlotRecipe: vi.fn(() => ({})),
    ChakraProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    defaultSystem: {},
  }
})

// Mock next-intl — useTranslations returns the key (with interpolation support)
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    if (!params) return key

    return Object.entries(params).reduce(
      (s, [k, v]) => s.replace(`{${k}}`, v),
      key,
    )
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

// Mock @app/theme — provide simple stub implementations for all commonly used components
vi.mock('@app/theme', async () => {
  const createStub =
    (tag = 'div') =>
    ({
      children,
      ...props
    }: {
      children?: React.ReactNode
      [key: string]: unknown
    }) =>
      React.createElement(tag, { 'data-testid': undefined, ...props }, children)

  return {
    // Dialog components
    DialogRoot: ({
      children,
      open,
    }: {
      children?: React.ReactNode
      open?: boolean
    }) =>
      open ? React.createElement('div', { role: 'dialog' }, children) : null,
    DialogContent: createStub(),
    DialogHeader: createStub(),
    DialogTitle: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('h2', {}, children),
    DialogBody: createStub(),
    DialogFooter: createStub(),
    DialogCloseTrigger: () => null,
    DialogActionTrigger: createStub('button'),
    DialogBackdrop: () => null,

    // Field components
    Field: ({
      children,
      label,
    }: {
      children?: React.ReactNode
      label?: string
    }) =>
      React.createElement(
        'div',
        {},
        label ? React.createElement('label', {}, label) : null,
        children,
      ),
    FieldRoot: createStub(),
    FieldLabel: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('label', {}, children),

    // Pagination
    PaginationRoot: createStub(),
    PaginationItems: () => null,
    PaginationPrevTrigger: createStub('button'),
    PaginationNextTrigger: createStub('button'),

    // Design system provider
    DesignSystemProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', {}, children),

    // Toaster
    Toaster: () => null,
    toaster: {
      create: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    },

    // Other commonly used exports
    PasswordInput: createStub('input'),
    NativeSelectRoot: createStub(),
    NativeSelectField: createStub('select'),
    InputGroup: createStub(),
  }
})
