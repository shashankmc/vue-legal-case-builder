// What the form asks the host to do for it.
//
// This package builds a case and never sends one. Anything that needs the API
// is handed back to whoever mounted the form: a component that calls the API
// needs a credential, and a credential in a page is readable by everyone using
// it. Same rule as vue-legal-query-builder.

import { inject, provide, type InjectionKey } from 'vue'
import type { CaseV1 } from 'legal-provision-types'
import type { CaseSummary } from './types'

export interface HostCallbacks {
  listCases?: () => Promise<CaseSummary[]>
  loadCase?: (caseId: string) => Promise<CaseV1>
}

const key: InjectionKey<HostCallbacks> = Symbol('legal-case-builder-host')

export function provideHostCallbacks(callbacks: HostCallbacks): void {
  provide(key, callbacks)
}

export function useHostCallbacks(): HostCallbacks {
  return inject(key, {})
}
