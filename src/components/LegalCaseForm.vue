<template>
  <div class="legal-case-form">
    <h2 v-if="props.title" class="title">{{ props.title }}</h2>
    <p v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</p>

    <!-- Mode switch, only when a custom case is allowed and scenarios exist. -->
    <div v-if="showModeSwitch" class="mode-switch">
      <button
        type="button"
        :class="{ active: mode === 'scenario' }"
        @click="mode = 'scenario'"
      >
        Prepared scenarios
      </button>
      <button
        type="button"
        :class="{ active: mode === 'custom' }"
        @click="mode = 'custom'"
      >
        Own case
      </button>
    </div>

    <!-- Scenario mode -->
    <div v-if="mode === 'scenario'" class="scenario-mode">
      <label class="field">
        <span>Scenario</span>
        <select v-model="selectedId" :disabled="loadingCases" @change="onSelectScenario">
          <option value="">{{ loadingCases ? 'Loading…' : 'Select a scenario…' }}</option>
          <option v-for="c in cases" :key="c.case_id" :value="c.case_id">
            {{ c.title }}
          </option>
        </select>
      </label>

      <div v-if="loadError" class="error">{{ loadError }}</div>

      <div v-if="loadedCase" class="case-brief">
        <h3>{{ loadedCase.title }}</h3>
        <p>{{ loadedCase.fact_pattern }}</p>
        <div class="facts">
          <span v-for="fact in factList" :key="fact.key" class="fact-chip">
            <b>{{ fact.label }}:</b> {{ fact.value }}
          </span>
        </div>
      </div>

      <div class="actions">
        <button
          type="button"
          class="primary"
          :disabled="!loadedCase"
          @click="submitScenario"
        >
          Use this case
        </button>
      </div>
    </div>

    <!-- Custom mode -->
    <div v-else class="custom-mode">
      <label class="field">
        <span>Case title</span>
        <input
          v-model="customTitle"
          type="text"
          placeholder="e.g. Halden Biocatalysis"
        />
      </label>

      <label class="field">
        <span>Fact pattern</span>
        <textarea
          v-model="customFactPattern"
          rows="5"
          placeholder="Describe the factual situation…"
        ></textarea>
      </label>

      <div v-if="props.factFields && props.factFields.length" class="facts-form">
        <label v-for="field in props.factFields" :key="field.key" class="field fact-field">
          <span>{{ field.label ?? field.key }}</span>
          <input
            v-model="customFacts[field.key]"
            type="text"
            :placeholder="field.placeholder ?? ''"
          />
        </label>
      </div>

      <div v-if="!customValid && submitted" class="error">
        A title and a fact pattern are required.
      </div>

      <div class="actions">
        <button type="button" class="primary" @click="submitCustom">Use this case</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { CaseV1 } from 'legal-provision-types'
import {
  FormType,
  type CaseOrigin,
  type CaseSummary,
  type LegalCaseFormProps,
} from './types'
import { buildCustomCase, CUSTOM_CASE_ID, factEntries, isCustomCaseValid, summaryToCase } from './case'
import { provideHostCallbacks } from './hostCallbacks'

const props = withDefaults(defineProps<LegalCaseFormProps>(), {
  type: FormType.GUIDED,
})

// Provided for child blocks; this component reads its props directly because a
// component cannot inject what it itself provides.
provideHostCallbacks({
  listCases: () => props.onListCases?.() ?? Promise.resolve([]),
  loadCase: (caseId) => props.onLoadCase?.(caseId) ?? Promise.resolve(summaryToCase({ case_id: caseId, title: caseId })),
})

const host = {
  listCases: () => props.onListCases?.() ?? Promise.resolve([]),
  loadCase: (caseId: string) => props.onLoadCase?.(caseId) ?? Promise.resolve(summaryToCase({ case_id: caseId, title: caseId })),
}

const emit = defineEmits<{
  submit: [caseValue: CaseV1]
  provenance: [event: { action: string; target_kind: 'case'; target_id?: string }]
}>()

const cases = ref<CaseSummary[]>([])
const loadingCases = ref(false)
const loadError = ref<string | null>(null)
const selectedId = ref('')
const loadedCase = ref<CaseV1 | null>(null)

const customTitle = ref('')
const customFactPattern = ref('')
const customFacts = reactive<Record<string, string>>({})
const submitted = ref(false)

// Start in scenario mode unless the host asked for custom; a scenario with no
// cases loaded falls back to custom (see onMounted).
const mode = ref<CaseOrigin>(props.defaultMode ?? 'scenario')

// A custom case is always available; the switch only makes sense once scenarios
// load, but is shown up front so the user knows both are possible.
const showModeSwitch = computed(() => props.defaultMode !== 'custom' || cases.value.length > 0)

const factList = computed(() => factEntries(loadedCase.value?.facts, props.factFields))
const customValid = computed(() => isCustomCaseValid(customTitle.value, customFactPattern.value))

onMounted(async () => {
  loadingCases.value = true
  try {
    cases.value = (await host.listCases?.()) ?? []
    // No prepared cases to pick from: go straight to the custom form.
    if (cases.value.length === 0 && props.defaultMode !== 'custom') mode.value = 'custom'
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Could not load scenarios'
  } finally {
    loadingCases.value = false
  }
})

async function onSelectScenario() {
  if (!selectedId.value) {
    loadedCase.value = null
    return
  }
  loadError.value = null
  try {
    loadedCase.value = await host.loadCase?.(selectedId.value) ?? null
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Could not load the scenario'
    loadedCase.value = null
  }
}

function submitScenario() {
  if (!loadedCase.value) return
  emit('submit', loadedCase.value)
  emit('provenance', { action: 'load_scenario', target_kind: 'case', target_id: loadedCase.value.case_id })
}

function submitCustom() {
  submitted.value = true
  if (!customValid.value) return
  emit('submit', buildCustomCase(customTitle.value, customFactPattern.value, customFacts))
  emit('provenance', { action: 'create_case', target_kind: 'case' })
}
</script>

<style scoped>
.legal-case-form {
  font-family: inherit;
  color: #1a1a2e;
}
.title {
  margin: 0 0 4px;
  font-size: 18px;
}
.subtitle {
  margin: 0 0 16px;
  color: #5a6a7a;
  font-size: 13px;
}
.mode-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.mode-switch button {
  padding: 6px 14px;
  border: 1px solid #d8e3eb;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.mode-switch button.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 13px;
}
.field > span {
  color: #5a6a7a;
}
.field select,
.field input,
.field textarea {
  padding: 8px 10px;
  border: 1px solid #d8e3eb;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}
.facts-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0 12px;
}
.case-brief {
  border: 1px solid #d8e3eb;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
  background: #f8fafc;
}
.case-brief h3 {
  margin: 0 0 6px;
  font-size: 15px;
}
.case-brief p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.5;
}
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.fact-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #eef2f7;
  color: #5a6a7a;
}
.fact-chip b {
  color: #1a1a2e;
}
.actions {
  margin-top: 8px;
}
.primary {
  background: #3b82f6;
  color: #fff;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}
.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 8px;
}
</style>
