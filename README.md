# vue-legal-case-builder

BlueLab case builder: pick a prepared compliance scenario, or write your own
case as a fact pattern plus structured facts. Emits **`case@1`**.

This package never calls an API. It builds a case and hands it back to you:
the host makes the requests, so no credential reaches the browser. Same rule as
[`vue-legal-query-builder`](https://github.com/MaastrichtU-BISS/vue-legal-query-builder).

```bash
npm install vue-legal-case-builder vue
```

```vue
<template>
  <LegalCaseForm
    type="guided"
    title="Describe the case"
    :on-list-cases="listCases"
    :on-load-case="loadCase"
    :fact-fields="factFields"
    @submit="onSubmit"
    @provenance="onProvenance"
  />
</template>

<script setup lang="ts">
import { LegalCaseForm } from 'vue-legal-case-builder'
import 'vue-legal-case-builder/style.css'
import type { CaseV1 } from 'legal-provision-types'

const listCases = () => fetch('/api/cases').then((r) => r.json())
const loadCase = (id: string) => fetch(`/api/case?id=${id}`).then((r) => r.json())
const factFields = [
  { key: 'who', label: 'Who' },
  { key: 'what', label: 'What' },
  { key: 'where_collected', label: 'Where collected' },
]

const onSubmit = (caseValue: CaseV1) => {
  // `caseValue` is case@1. Send it wherever you like — the form never did.
  console.log(caseValue)
}
const onProvenance = (event: unknown) => console.log(event)
</script>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onListCases` | `() => Promise<CaseSummary[]>` | — | Lists the prepared cases. Called once on mount. |
| `onLoadCase` | `(caseId: string) => Promise<CaseV1>` | — | Loads one case's full brief. |
| `type` | `'guided' \| 'free'` | `'guided'` | Form mode, mirroring the query builder. |
| `title` | `string` | — | Form title. |
| `subtitle` | `string` | — | Form subtitle. |
| `factFields` | `FactField[]` | `[]` | Structured-fact fields the custom form offers, in order. |
| `defaultMode` | `'scenario' \| 'custom'` | `'scenario'` | Which mode to start in. |

## Events

| Event | Payload | Description |
|---|---|---|
| `@submit` | `CaseV1` | Emitted when a case is chosen or entered. |
| `@provenance` | `{ action, target_kind, target_id? }` | Emitted on load (`load_scenario`) and on custom submit (`create_case`). |

## Types

| Type | Shape |
|---|---|
| `CaseV1` (`case@1`) | `{ case_id?, title, fact_pattern, facts, origin }` from `legal-provision-types` |
| `CaseSummary` | `{ case_id, title }` |
| `FactField` | `{ key, label?, placeholder? }` |

Pure helpers are exported too: `buildCustomCase`, `factEntries`,
`isCustomCaseValid`, `summaryToCase`.

## Development

```bash
npm install
npm test        # vitest component + helper tests
npm run build   # library build to dist/
```

Tests map to Appendix D.1 of the BlueLab modularization plan: scenario listing,
the brief card, the `load_scenario` provenance event, and the custom case.
