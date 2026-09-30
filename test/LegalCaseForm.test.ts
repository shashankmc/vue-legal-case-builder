// Component tests, one per Appendix D.1 item owned by the case builder.
//
// D.1 #1  scenarios listed from onListCases
// D.1 #2  selecting a scenario shows the brief: title, fact pattern, fact chips
// D.1 #4  loading a scenario emits a load_scenario provenance event
// D.1 #6Δ a custom case (fact pattern + facts) can be entered

import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import LegalCaseForm from '../src/components/LegalCaseForm.vue'
import { FormType } from '../src/components/types'

const CASES = [
  { case_id: 'halden', title: 'Halden Biocatalysis' },
  { case_id: 'novamare', title: 'Novamare' },
]

const HALDEN = {
  case_id: 'halden',
  title: 'Halden Biocatalysis',
  fact_pattern: 'A Norwegian SME isolates an esterase in ABNJ.',
  facts: { who: 'Halden Enzyme Solutions', what: 'esterase' },
  origin: 'scenario' as const,
}

function mountForm(props: Record<string, unknown> = {}) {
  return mount(LegalCaseForm, {
    props: { type: FormType.GUIDED, ...props },
  })
}

describe('LegalCaseForm', () => {
  it('D.1 #1 lists every scenario from onListCases', async () => {
    const onListCases = vi.fn().mockResolvedValue(CASES)
    const wrapper = mountForm({ onListCases })
    await flushPromises()

    expect(onListCases).toHaveBeenCalledOnce()
    const options = wrapper.findAll('select option').map((o) => o.text())
    expect(options).toContain('Halden Biocatalysis')
    expect(options).toContain('Novamare')
  })

  it('D.1 #2 shows the brief card: title, fact pattern and a chip per fact', async () => {
    const wrapper = mountForm({
      onListCases: vi.fn().mockResolvedValue(CASES),
      onLoadCase: vi.fn().mockResolvedValue(HALDEN),
    })
    await flushPromises()

    await wrapper.find('select').setValue('halden')
    await flushPromises()

    expect(wrapper.find('.case-brief h3').text()).toBe('Halden Biocatalysis')
    expect(wrapper.find('.case-brief p').text()).toContain('isolates an esterase')
    const chips = wrapper.findAll('.fact-chip').map((c) => c.text())
    expect(chips).toHaveLength(2)
    expect(chips[0]).toContain('who')
    expect(chips[0]).toContain('Halden Enzyme Solutions')
  })

  it('D.1 #4 emits load_scenario provenance and the case on submit', async () => {
    const wrapper = mountForm({
      onListCases: vi.fn().mockResolvedValue(CASES),
      onLoadCase: vi.fn().mockResolvedValue(HALDEN),
    })
    await flushPromises()

    await wrapper.find('select').setValue('halden')
    await flushPromises()
    await wrapper.find('.primary').trigger('click')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual(HALDEN)
    expect(wrapper.emitted('provenance')?.[0]?.[0]).toEqual({
      action: 'load_scenario',
      target_kind: 'case',
      target_id: 'halden',
    })
  })

  it('D.1 #6Δ a custom case can be entered and is emitted as case@1', async () => {
    const wrapper = mountForm({
      onListCases: vi.fn().mockResolvedValue([]),
      factFields: [{ key: 'who' }, { key: 'what' }],
    })
    await flushPromises()

    // With no scenarios, the form should have fallen back to custom mode.
    expect(wrapper.find('.custom-mode').exists()).toBe(true)

    // .custom-mode inputs: [0] title, then one per fact field in order.
    const inputs = wrapper.findAll('.custom-mode input[type="text"]')
    await inputs[0].setValue('My Custom Case')
    await wrapper.find('textarea').setValue('Some facts in prose.')
    await inputs[1].setValue('Acme Corp') // who
    await wrapper.find('.primary').trigger('click')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      title: 'My Custom Case',
      fact_pattern: 'Some facts in prose.',
      facts: { who: 'Acme Corp' },
      origin: 'custom',
    })
  })

  it('D.1 #6Δ blocks an empty custom case', async () => {
    const wrapper = mountForm({ onListCases: vi.fn().mockResolvedValue([]) })
    await flushPromises()

    await wrapper.find('.primary').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('surfaces an error when the scenario list fails', async () => {
    const wrapper = mountForm({
      onListCases: vi.fn().mockRejectedValue(new Error('offline')),
    })
    await flushPromises()

    expect(wrapper.find('.error').text()).toContain('offline')
  })
})
