import { interpret, Interpreter, StateValue } from 'xstate'
import { createDataMachine, DataContext, DataEvents, DataSchema } from './fetch-data-machine'

describe('fetchDataMachine', () => {
  let testMachine: Interpreter<DataContext<unknown>, DataSchema, DataEvents> | undefined = undefined
  let stateArray: StateValue[] = []
  const dataMachine = createDataMachine<unknown>('testMachine')

  beforeEach(() => {
    testMachine = undefined
    stateArray = []
  })

  afterEach(() => {
    testMachine?.stop()
  })

  it('should go to the success.withData state for successful data fetch containing data', (done) => {
    const machineConfig = {
      services: {
        fetchData: jest.fn().mockImplementation(() => Promise.resolve({ test: 'success!' })),
      },
    }

    testMachine = interpret(dataMachine.withConfig(machineConfig))
      .onTransition((state) => {
        stateArray.push(state.value)

        if (state.matches('success.withData')) {
          // make sure all expected service methods have been called at some point
          expect(machineConfig.services.fetchData).toHaveBeenCalledTimes(1)

          expect(stateArray).toEqual(['idle', 'loading', { success: 'withData' }])
          // This should be called in the last state we expect to be in as it tells
          // jest when it should complete a test that is (or has) asynchronous activity
          done()
        }
      })
      .start()

    testMachine?.send('FETCH')
  })

  it('should go to the success.withoutData state for successful data fetch containing an empty string', (done) => {
    const machineConfig = {
      services: {
        fetchData: jest.fn().mockImplementation(() => Promise.resolve('')),
      },
    }

    testMachine = interpret(dataMachine.withConfig(machineConfig))
      .onTransition((state) => {
        stateArray.push(state.value)

        if (state.matches('success.withoutData')) {
          // make sure all expected service methods have been called at some point
          expect(machineConfig.services.fetchData).toHaveBeenCalledTimes(1)

          expect(stateArray).toEqual(['idle', 'loading', { success: 'withoutData' }])
          // This should be called in the last state we expect to be in as it tells
          // jest when it should complete a test that is (or has) asynchronous activity
          done()
        }
      })
      .start()

    testMachine?.send('FETCH')
  })

  it('should go to the success.withoutData state for successful data fetch containing an empty object', (done) => {
    const machineConfig = {
      services: {
        fetchData: jest.fn().mockImplementation(() => Promise.resolve({})),
      },
    }

    testMachine = interpret(dataMachine.withConfig(machineConfig))
      .onTransition((state) => {
        stateArray.push(state.value)

        if (state.matches('success.withoutData')) {
          // make sure all expected service methods have been called at some point
          expect(machineConfig.services.fetchData).toHaveBeenCalledTimes(1)

          expect(stateArray).toEqual(['idle', 'loading', { success: 'withoutData' }])
          // This should be called in the last state we expect to be in as it tells
          // jest when it should complete a test that is (or has) asynchronous activity
          done()
        }
      })
      .start()

    testMachine?.send('FETCH')
  })

  it('should go to the success.withoutData state for successful data fetch containing an empty array', (done) => {
    const machineConfig = {
      services: {
        fetchData: jest.fn().mockImplementation(() => Promise.resolve([])),
      },
    }

    testMachine = interpret(dataMachine.withConfig(machineConfig))
      .onTransition((state) => {
        stateArray.push(state.value)

        if (state.matches('success.withoutData')) {
          // make sure all expected service methods have been called at some point
          expect(machineConfig.services.fetchData).toHaveBeenCalledTimes(1)

          expect(stateArray).toEqual(['idle', 'loading', { success: 'withoutData' }])
          // This should be called in the last state we expect to be in as it tells
          // jest when it should complete a test that is (or has) asynchronous activity
          done()
        }
      })
      .start()

    testMachine?.send('FETCH')
  })

  it('should go to the failure state for an unsuccessful data fetch that resulted in error', (done) => {
    const machineConfig = {
      services: {
        fetchData: jest.fn().mockImplementation(() => Promise.reject({})),
      },
    }

    testMachine = interpret(dataMachine.withConfig(machineConfig))
      .onTransition((state) => {
        stateArray.push(state.value)

        if (state.matches('failure')) {
          // make sure all expected service methods have been called at some point
          expect(machineConfig.services.fetchData).toHaveBeenCalledTimes(1)

          expect(stateArray).toEqual(['idle', 'loading', 'failure'])
          // This should be called in the last state we expect to be in as it tells
          // jest when it should complete a test that is (or has) asynchronous activity
          done()
        }
      })
      .start()

    testMachine?.send('FETCH')
  })
})
