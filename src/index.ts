import type { App, Plugin } from 'vue'

import LegalCaseForm from './components/LegalCaseForm.vue'
export { LegalCaseForm }

export { FormType } from './components/types'
export type {
  LegalCaseFormProps,
  CaseSummary,
  FactField,
  CaseOrigin,
  CaseSubmission,
} from './components/types'

// Pure helpers, exported so a host can reuse them without the component.
export {
  buildCustomCase,
  factEntries,
  isCustomCaseValid,
  summaryToCase,
  CUSTOM_CASE_ID,
} from './components/case'

// The port contract this package emits, re-exported so a consumer needs one
// import. Types only: this package never calls an API.
export type { CaseV1 } from 'legal-provision-types'

export const VueLegalCaseBuilderPlugin: Plugin = {
  install(app: App) {
    app.component('LegalCaseForm', LegalCaseForm)
  },
}

export default VueLegalCaseBuilderPlugin
