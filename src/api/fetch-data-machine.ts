import { ActionObject, assign, DoneInvokeEvent, Machine, StateMachine } from 'xstate'
import * as Sentry from '@sentry/browser'
import { isEmpty } from 'lodash-es'

export interface DataSchema {
  states: {
    idle: Record<string, unknown>
    loading: Record<string, unknown>
    success: {
      states: {
        unknown: Record<string, unknown>
        withData: Record<string, unknown>
        withoutData: Record<string, unknown>
      }
    }
    failure: Record<string, unknown>
  }
}

export type DataEvents = { type: 'FETCH' }

export interface DataContext<TResults> {
  results?: TResults
  error?: Error
}

const actions = {
  assignResults: assign({
    results: (_, event: DoneInvokeEvent<unknown>) => event.data,
  }) as ActionObject<DataContext<unknown>, DataEvents>,
  assignError: assign({
    error: (_, event: DoneInvokeEvent<never>) => event.data,
  }) as ActionObject<DataContext<unknown>, DataEvents>,
  recordError: (context: DataContext<unknown>) => {
    Sentry.captureException(context.error)
  },
  successCallback: () => {
    // do nothing by default, override this for your specific use case
  },
}

const guards = {
  hasData: (ctx: DataContext<unknown>) => !!ctx.results && !isEmpty(ctx.results),
}

export const createDataMachine = <TResults>(
  machineId: string
): StateMachine<DataContext<TResults>, DataSchema, DataEvents> =>
  Machine<DataContext<TResults>, DataSchema, DataEvents>(
    {
      id: machineId,
      initial: 'idle',
      context: {
        results: undefined,
        error: undefined,
      },
      states: {
        idle: {
          on: {
            FETCH: 'loading',
          },
        },
        loading: {
          invoke: {
            src: 'fetchData',
            onDone: { target: 'success' },
            onError: { target: 'failure', actions: 'assignError' },
          },
        },
        success: {
          entry: ['assignResults', 'successCallback'],
          on: {
            FETCH: 'loading',
          },
          initial: 'unknown',
          states: {
            unknown: {
              always: [{ target: 'withData', cond: 'hasData' }, { target: 'withoutData' }],
            },
            withData: {},
            withoutData: {},
          },
        },
        failure: {
          entry: 'recordError',
          on: {
            FETCH: 'loading',
          },
        },
      },
    },
    {
      actions,
      guards,
    }
  )
