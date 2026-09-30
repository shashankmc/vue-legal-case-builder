import type { CaseV1 } from 'legal-provision-types'

/** Form mode, mirroring the query builder. */
export enum FormType {
  FREE = 'free',
  GUIDED = 'guided',
}

/**
 * A prepared case as the host lists it. This is a convenience subset of the
 * host's scenario; the full case is fetched on demand with `onLoadCase`.
 */
export interface CaseSummary {
  /** Stable id, passed to `onLoadCase`. */
  case_id: string
  title: string
}

/**
 * A structured-fact field the free form offers a chip input for. The keys are
 * the host's `facts` keys (e.g. brief.json's `who`, `what`, `where_collected`).
 */
export interface FactField {
  key: string
  label?: string
  placeholder?: string
}

export interface LegalCaseFormProps {
  title?: string
  subtitle?: string
  type?: FormType
  /**
   * Lists the prepared cases a user can pick. Called once on mount. The form
   * never fetches anything itself: point this at your own server.
   */
  onListCases?: () => Promise<CaseSummary[]>
  /**
   * Loads one prepared case's full brief. Called when a user selects a case.
   * Returns a `case@1` (or the subset the host has).
   */
  onLoadCase?: (caseId: string) => Promise<CaseV1>
  /**
   * Which structured-fact fields the custom form offers, in order. When
   * omitted, no fact chips are offered.
   */
  factFields?: FactField[]
  /** Which mode the form starts in when `cases` are available. */
  defaultMode?: CaseOrigin
}

/** Where the case came from: a prepared scenario or the custom form. */
export type CaseOrigin = 'scenario' | 'custom'

/** What the host is told when the form is submitted. */
export type CaseSubmission = CaseV1
