import { useState } from 'react'

export type BusMap<K extends string> = {
  [key in K]?: BusCallback[] | undefined
}

export type BusCallback<P = never> = (payload: P) => void

export type UseEventBusReturn = ReturnType<typeof useEventBus>

/**
 * A hook providing functionality for an event bus. Enables subscribing to, emitting, removing, and resetting events.
 *
 * - `bus`: The event bus map, containing events and their respective callbacks.
 * - `on(key: K, callback: BusCallback)`: Registers a callback function for a specified event.
 * - `off(key: K, callback: BusCallback)`: Unsubscribes a callback function from a specified event.
 * - `emit(key: K, payload: unknown)`: Triggers all callback functions associated with the specified event and passes the provided payload.
 * - `reset()`: Clears all events and their associated callbacks from the bus.
 */
export function useEventBus<K extends string>() {
  const [bus, setBus] = useState<BusMap<K>>({})

  function on(key: K, callback: BusCallback) {
    setBus((bus) => {
      bus[key] = [...(bus[key] ?? []), callback]

      return bus
    })
  }

  function off(key: K, callback: BusCallback) {
    setBus((bus) => {
      bus[key] = bus[key]?.filter((it: BusCallback) => it !== callback)

      return bus
    })
  }

  function emit(key: K, payload: never) {
    for (const callback of bus[key] ?? []) {
      callback(payload)
    }
  }

  function reset() {
    setBus({})
  }

  return { bus, on, off, emit, reset }
}
