const defaultFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(
  date: string | Date,
  formatter: Intl.DateTimeFormat = defaultFormatter,
): string {
  return formatter.format(typeof date === 'string' ? new Date(date) : date)
}
