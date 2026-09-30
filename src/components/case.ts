// Pure helpers for building a case@1. Kept free of Vue so they are testable
// without mounting a component, and so the emitted shape is obvious.

import type { CaseV1 } from 'legal-provision-types'
import type { CaseSummary, FactField } from './types'

/** A scenario summary, or the custom placeholder, as an option value. */
export const CUSTOM_CASE_ID = '__custom__'

/**
 * Turn a host's scenario summary into the `case@1` shape when the host has not
 * supplied a full brief (a minimal fallback; `onLoadCase` normally provides it).
 */
export function summaryToCase(summary: CaseSummary): CaseV1 {
  return {
    case_id: summary.case_id,
    title: summary.title,
    fact_pattern: '',
    facts: {},
    origin: 'scenario',
  }
}

/**
 * Build a `case@1` from the custom form's inputs, dropping empty facts.
 *
 * @param title the case title
 * @param factPattern the free-text fact pattern
 * @param facts key -> value as entered; blank values are dropped
 */
export function buildCustomCase(
  title: string,
  factPattern: string,
  facts: Record<string, string>,
): CaseV1 {
  const clean: Record<string, string> = {}
  for (const [key, value] of Object.entries(facts)) {
    const trimmed = (value ?? '').trim()
    if (trimmed) clean[key] = trimmed
  }
  return {
    title: title.trim(),
    fact_pattern: factPattern.trim(),
    facts: clean,
    origin: 'custom',
  }
}

/** The fact chips to show for a case, in field order, blanks omitted. */
export function factEntries(
  facts: Record<string, unknown> | undefined,
  fields: FactField[] = [],
): { key: string; label: string; value: string }[] {
  if (!facts) return []
  const order = fields.map((f) => f.key)
  const keys = [
    ...order.filter((k) => k in facts),
    ...Object.keys(facts).filter((k) => !order.includes(k)),
  ]
  return keys.map((key) => ({
    key,
    label: fields.find((f) => f.key === key)?.label ?? key,
    value: String(facts[key]),
  }))
}

/** Whether a custom case has enough to be submitted. */
export function isCustomCaseValid(title: string, factPattern: string): boolean {
  return title.trim().length > 0 && factPattern.trim().length > 0
}
