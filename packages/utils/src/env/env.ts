/**
 * Retrieves an environment variable string, providing an optional fallback value.
 * If the provided environment variable is undefined, the fallback value is returned.
 * If neither the environment variable nor a fallback is provided, an empty string is returned.
 */
export const getEnvString = <T extends string = string>(
  env: string | undefined,
  fallback?: T,
) => (env || fallback || '') as T

/**
 * Parses an environment variable string into a number, with optional fallback and type inference.
 */
export const getEnvNumber = <T extends number = number>(
  env: string | undefined,
  fallback?: T,
) => (Number(env) || fallback || 0) as T

/**
 * Parses an environment variable string to determine a boolean value.
 */
export const getEnvBoolean = (env: string | undefined, fallback?: boolean) =>
  !env && fallback !== undefined ? fallback : env === 'true'

/**
 * Parses an environment variable as a comma-separated string and returns it as an array of strings.
 */
export const getEnvStringArray = <T extends string = string>(
  env: string | undefined,
  fallback?: T,
) => getEnvString(env, fallback).split(',') as T[]

/**
 * Parses a comma-separated environment variable string into an array of numbers.
 *
 * This function retrieves the value of the specified environment variable,
 * splits it by commas, and converts each segment into a number. If the
 * environment variable is undefined or empty, the function will return the
 * provided fallback array or an empty array if no fallback is specified.
 */
export const getEnvNumberArray = <T extends number = number>(
  env: string | undefined,
  fallback?: T[],
) => {
  const envStr = getEnvString(env)

  return envStr
    ? (envStr.split(',').map((it) => Number(it) || 0) as T[])
    : (fallback ?? [])
}
