import { describe, expect, it } from 'vitest'
import { buildCustomCase, factEntries, isCustomCaseValid, summaryToCase } from '../src/components/case'

describe('case helpers', () => {
  it('buildCustomCase trims and drops blank facts', () => {
    const c = buildCustomCase('  Halden  ', '  A fact pattern.  ', {
      who: ' Halden ',
      what: '',
      where: '   ',
    })
    expect(c).toEqual({
      title: 'Halden',
      fact_pattern: 'A fact pattern.',
      facts: { who: 'Halden' },
      origin: 'custom',
    })
    expect(c.case_id).toBeUndefined()
  })

  it('summaryToCase gives a scenario-shaped fallback', () => {
    expect(summaryToCase({ case_id: 'halden', title: 'Halden' })).toEqual({
      case_id: 'halden',
      title: 'Halden',
      fact_pattern: '',
      facts: {},
      origin: 'scenario',
    })
  })

  it('factEntries keeps field order, then extras, and omits blanks', () => {
    const entries = factEntries(
      { what: 'esterase', who: 'Halden', orphan: 'x' },
      [{ key: 'who' }, { key: 'what' }, { key: 'missing' }],
    )
    expect(entries.map((e) => e.key)).toEqual(['who', 'what', 'orphan'])
    expect(entries[0]).toEqual({ key: 'who', label: 'who', value: 'Halden' })
  })

  it('factEntries returns nothing without facts', () => {
    expect(factEntries(undefined)).toEqual([])
  })

  it('isCustomCaseValid requires a title and a fact pattern', () => {
    expect(isCustomCaseValid('T', 'F')).toBe(true)
    expect(isCustomCaseValid('', 'F')).toBe(false)
    expect(isCustomCaseValid('T', '   ')).toBe(false)
  })
})
