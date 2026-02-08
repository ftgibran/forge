export function formatPermission(action: string, resource: string): string {
  return `${action}:${resource}`
}

export function parsePermission(permission: string): {
  action: string
  resource: string
} {
  const [action, ...rest] = permission.split(':')
  return { action, resource: rest.join(':') }
}

export function displayPermission(permission: string): string {
  const { action, resource } = parsePermission(permission)
  return `${capitalize(action)} ${capitalize(resource)}`
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
