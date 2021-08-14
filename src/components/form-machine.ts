import { ActionObject, assign, DoneInvokeEvent, Machine, StateMachine, StateSchema } from 'xstate'
//import * as Sentry from '@sentry/browser'
import { v4 as uuid } from 'uuid'

export interface FormContext<TFormData> {
  formData?: TFormData
  error?: Record<string, unknown>
}

type ChangeFormDataEvent<TFormData> = { type: 'CHANGE'; formData: TFormData }
export type FormEvents<TFormData> = ChangeFormDataEvent<TFormData> | { type: 'SUBMIT' | 'DISMISS' }

export interface FormSchema<TFormData> {
  states: {
    editing: StateSchema<FormContext<TFormData>>
    submitting: StateSchema<FormContext<TFormData>>
    success: StateSchema<FormContext<TFormData>>
    error: StateSchema<FormContext<TFormData>>
  }
}

const createActions = <TFormData>() => {
  return {
    assignFormData: assign({
      formData: (_, event) => event.formData,
    }) as ActionObject<FormContext<TFormData>, ChangeFormDataEvent<TFormData>>,
    assignError: assign({
      error: (_, event: DoneInvokeEvent<never>) => event.data,
    }) as ActionObject<FormContext<TFormData>, FormEvents<TFormData>>,
    recordError: (context: FormContext<TFormData>) => {
      //Sentry.captureException(context.error)
    },
    clearError: assign({
      error: undefined,
    }) as ActionObject<FormContext<unknown>, FormEvents<unknown>>,
    successCallback: () => {
      // do nothing by default, override this for your specific use case
    },
  }
}

/**
 * Create a form state machine.  Make sure to create a 'submit' service to handle form submission using `.withConfig()`
 *
 * @param options
 *  id: The machine id, mostly for debugging.<br>
 *  initialFormData: (optional) initial TFormData, useful if editing an existing object/value
 */
export const createFormMachine = <TFormData>(
  options: { id?: string; initialFormData?: TFormData } = {
    id: 'form-machine-' + uuid(),
    initialFormData: undefined,
  }
): StateMachine<FormContext<TFormData>, FormSchema<TFormData>, FormEvents<TFormData>> =>
  Machine<FormContext<TFormData>, FormSchema<TFormData>, FormEvents<TFormData>>(
    {
      id: options.id,
      context: {
        formData: options.initialFormData,
      },
      initial: 'editing',
      states: {
        editing: {
          on: {
            CHANGE: {
              actions: 'assignFormData',
            },
            SUBMIT: 'submitting',
          },
        },
        submitting: {
          invoke: {
            id: 'submit',
            src: 'submit',
            onDone: {
              target: 'success',
              actions: 'successCallback',
            },
            onError: {
              target: 'error',
              actions: 'assignError',
            },
          },
        },
        success: {
          on: {
            // Continue making changes in the form
            CHANGE: {
              target: 'editing',
              actions: 'assignFormData',
            },

            // Dismiss success (in case you just need to get out of the success state e.g. to close a modal)
            DISMISS: 'editing',
          },
        },
        error: {
          entry: 'recordError',
          exit: 'clearError',
          on: {
            // Re-submit current data (transient network issues)
            SUBMIT: 'submitting',

            // Update data in form (validation issues)
            CHANGE: {
              target: 'editing',
              actions: 'assignFormData',
            },

            // Dismiss error (in case you just need to get out of the error state e.g. to close a modal)
            DISMISS: 'editing',
          },
        },
      },
    },
    {
      actions: createActions<TFormData>(),
    }
  )
