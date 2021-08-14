import { createFormMachine, FormContext } from '@/components/form-machine'
import { interpret } from 'xstate'

describe('form-machine.ts', () => {
  it('should start in editing state with undefined formData', () => {
    const service = interpret(createFormMachine<string>()).start()

    expect(service.state.value).toEqual('editing')
    expect(service.state.context.formData).toBeUndefined()
  })

  it('should start in editing state with initial context', () => {
    const service = interpret(createFormMachine<string>({ initialFormData: 'initial' })).start()

    expect(service.state.value).toEqual('editing')
    expect(service.state.context.formData).toEqual('initial')
  })

  it('should call submit on SUBMIT event', (done) => {
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: (context) => {
            expect(context.formData).toEqual('initial')
            done()
            return Promise.resolve()
          },
        },
      })
    ).start()

    service.send('SUBMIT')
  })

  it('should be in error state when submit fails', (done) => {
    const testError = new Error('test message')
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: () => {
            return Promise.reject(testError)
          },
        },
      })
    ).start()

    service.onTransition((state) => {
      if (state.matches('error')) {
        expect(state.context.error).toEqual(testError)
        done()
      }
    })

    service.send('SUBMIT')
  })

  it('should allow re-submit after error', (done) => {
    let count = 0
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: () => {
            if (++count === 1) {
              return Promise.reject('error message')
            } else {
              return Promise.resolve()
            }
          },
        },
      })
    ).start()

    service.onTransition((state) => {
      if (state.matches('error')) {
        expect(state.context.error).toEqual('error message')
        service.send('SUBMIT')
      }
      if (state.matches('success')) {
        expect(state.context.formData).toEqual('initial')
        expect(state.context.error).toBeUndefined()
        done()
      }
    })

    service.send('SUBMIT')
  })

  it('should allow continued editing and submit on change after error', (done) => {
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: (context: FormContext<string>) => {
            if (context.formData === 'initial') {
              return Promise.reject('error message')
            } else {
              return Promise.resolve()
            }
          },
        },
      })
    ).start()

    service.onTransition((state) => {
      if (state.matches('error')) {
        expect(state.context.error).toEqual('error message')
        service.send({ type: 'CHANGE', formData: 'recovered' })
        service.send('SUBMIT')
      }
      if (state.matches('success')) {
        expect(state.context.formData).toEqual('recovered')
        expect(state.context.error).toBeUndefined()
        done()
      }
    })

    service.send('SUBMIT')
  })

  it('should allow continued editing and submit on change after success', (done) => {
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: () => Promise.resolve(),
        },
      })
    ).start()

    service.onTransition((state) => {
      if (state.matches('success')) {
        if (state.context.formData === 'initial') {
          service.send({ type: 'CHANGE', formData: 'new data' })
          service.send('SUBMIT')
        } else if (state.context.formData === 'new data') {
          done()
        } else {
          throw new Error('unexpected formData value')
        }
      }
    })

    service.send('SUBMIT')
  })

  it('should fire successCallback on successful submit', (done) => {
    const machineConfig = {
      services: {
        submit: () => Promise.resolve(),
      },
      actions: {
        successCallback: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    }

    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig(machineConfig)
    ).start()

    service.onTransition((state) => {
      if (state.matches('success')) {
        expect(machineConfig.actions.successCallback).toHaveBeenCalledTimes(1)
        done()
      }
    })

    service.send('SUBMIT')
  })

  it('should be able to dismiss an error and return to editing', (done) => {
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: () => Promise.reject(),
        },
      })
    ).start()

    let count = 0
    service.onTransition((state) => {
      if (state.matches('error')) {
        service.send('DISMISS')
      }
      if (state.matches('editing')) {
        count++
        if (count === 1) {
          // initial editing state
          expect(state.context.formData).toEqual('initial')
          expect(state.context.error).toBeUndefined()
        }
        if (count === 2) {
          // post-DISMISS editing state
          expect(state.context.formData).toEqual('initial')
          expect(state.context.error).toBeUndefined()
          done()
        }
      }
    })

    service.send('SUBMIT')
  })

  it('should be able to dismiss success without change and return to editing', (done) => {
    const service = interpret(
      createFormMachine<string>({ initialFormData: 'initial' }).withConfig({
        services: {
          submit: () => Promise.resolve(),
        },
      })
    ).start()

    let count = 0
    service.onTransition((state) => {
      if (state.matches('success')) {
        service.send('DISMISS')
      }
      if (state.matches('editing')) {
        count++
        if (count === 1) {
          // initial editing state
          expect(state.context.formData).toEqual('initial')
          expect(state.context.error).toBeUndefined()
        }
        if (count === 2) {
          // post-DISMISS editing state
          expect(state.context.formData).toEqual('initial')
          expect(state.context.error).toBeUndefined()
          done()
        }
      }
    })

    service.send('SUBMIT')
  })
})
