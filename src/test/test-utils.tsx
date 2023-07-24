/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'
import React from 'react'
import AppProviders from './AppProviders'

afterEach(() => {
    cleanup()
})

function customRender(ui: React.ReactElement, options = {}) {
    return render(ui, {
        // wrap provider(s) here if needed
        wrapper: ({ children }) =>  <AppProviders>{ children }</AppProviders>,
        ...options,
    })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
