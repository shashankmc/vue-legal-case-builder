import type { DefineComponent, Plugin } from "vue";
import type { CaseV1 } from "legal-provision-types";

export { FormType } from "./components/types";
export type {
  LegalCaseFormProps,
  CaseSummary,
  FactField,
  CaseOrigin,
  CaseSubmission,
} from "./components/types";

export declare function buildCustomCase(
  title: string,
  factPattern: string,
  facts: Record<string, string>,
): CaseV1;

export declare function factEntries(
  facts: Record<string, unknown> | undefined,
  fields?: { key: string; label?: string; placeholder?: string }[],
): { key: string; label: string; value: string }[];

export declare function isCustomCaseValid(title: string, factPattern: string): boolean;

export declare function summaryToCase(summary: { case_id: string; title: string }): CaseV1;

export declare const CUSTOM_CASE_ID: "__custom__";

export declare const LegalCaseForm: DefineComponent<
  import("./components/types").LegalCaseFormProps,
  {},
  any
>;

export declare const VueLegalCaseBuilderPlugin: Plugin;

export default VueLegalCaseBuilderPlugin;
