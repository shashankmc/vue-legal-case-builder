import { provide as A, defineComponent as G, ref as f, reactive as H, computed as F, onMounted as $, openBlock as i, createElementBlock as u, toDisplayString as v, createCommentVNode as p, createElementVNode as o, normalizeClass as w, withDirectives as h, Fragment as S, renderList as E, vModelSelect as q, createTextVNode as z, vModelText as V } from "vue";
var D = /* @__PURE__ */ ((s) => (s.FREE = "free", s.GUIDED = "guided", s))(D || {});
const ke = "__custom__";
function x(s) {
  return {
    case_id: s.case_id,
    title: s.title,
    fact_pattern: "",
    facts: {},
    origin: "scenario"
  };
}
function I(s, d, e) {
  const c = {};
  for (const [n, m] of Object.entries(e)) {
    const _ = (m ?? "").trim();
    _ && (c[n] = _);
  }
  return {
    title: s.trim(),
    fact_pattern: d.trim(),
    facts: c,
    origin: "custom"
  };
}
function R(s, d = []) {
  if (!s) return [];
  const e = d.map((n) => n.key);
  return [
    ...e.filter((n) => n in s),
    ...Object.keys(s).filter((n) => !e.includes(n))
  ].map((n) => {
    var m;
    return {
      key: n,
      label: ((m = d.find((_) => _.key === n)) == null ? void 0 : m.label) ?? n,
      value: String(s[n])
    };
  });
}
function J(s, d) {
  return s.trim().length > 0 && d.trim().length > 0;
}
const K = Symbol("legal-case-builder-host");
function Q(s) {
  A(K, s);
}
const W = { class: "legal-case-form" }, X = {
  key: 0,
  class: "title"
}, Y = {
  key: 1,
  class: "subtitle"
}, Z = {
  key: 2,
  class: "mode-switch"
}, ee = {
  key: 3,
  class: "scenario-mode"
}, te = { class: "field" }, se = ["disabled"], ae = { value: "" }, le = ["value"], oe = {
  key: 0,
  class: "error"
}, ne = {
  key: 1,
  class: "case-brief"
}, ie = { class: "facts" }, ue = { class: "actions" }, ce = ["disabled"], re = {
  key: 4,
  class: "custom-mode"
}, de = { class: "field" }, ve = { class: "field" }, me = {
  key: 0,
  class: "facts-form"
}, _e = ["onUpdate:modelValue", "placeholder"], fe = {
  key: 1,
  class: "error"
}, pe = /* @__PURE__ */ G({
  __name: "LegalCaseForm",
  props: {
    title: {},
    subtitle: {},
    type: { default: D.GUIDED },
    onListCases: {},
    onLoadCase: {},
    factFields: {},
    defaultMode: {}
  },
  emits: ["submit", "provenance"],
  setup(s, { emit: d }) {
    const e = s;
    Q({
      listCases: () => {
        var a;
        return ((a = e.onListCases) == null ? void 0 : a.call(e)) ?? Promise.resolve([]);
      },
      loadCase: (a) => {
        var t;
        return ((t = e.onLoadCase) == null ? void 0 : t.call(e, a)) ?? Promise.resolve(x({ case_id: a, title: a }));
      }
    });
    const c = {
      listCases: () => {
        var a;
        return ((a = e.onListCases) == null ? void 0 : a.call(e)) ?? Promise.resolve([]);
      },
      loadCase: (a) => {
        var t;
        return ((t = e.onLoadCase) == null ? void 0 : t.call(e, a)) ?? Promise.resolve(x({ case_id: a, title: a }));
      }
    }, n = d, m = f([]), _ = f(!1), y = f(null), C = f(""), r = f(null), k = f(""), g = f(""), L = H({}), U = f(!1), b = f(e.defaultMode ?? "scenario"), P = F(() => e.defaultMode !== "custom" || m.value.length > 0), O = F(() => {
      var a;
      return R((a = r.value) == null ? void 0 : a.facts, e.factFields);
    }), M = F(() => J(k.value, g.value));
    $(async () => {
      var a;
      _.value = !0;
      try {
        m.value = await ((a = c.listCases) == null ? void 0 : a.call(c)) ?? [], m.value.length === 0 && e.defaultMode !== "custom" && (b.value = "custom");
      } catch (t) {
        y.value = t instanceof Error ? t.message : "Could not load scenarios";
      } finally {
        _.value = !1;
      }
    });
    async function B() {
      var a;
      if (!C.value) {
        r.value = null;
        return;
      }
      y.value = null;
      try {
        r.value = await ((a = c.loadCase) == null ? void 0 : a.call(c, C.value)) ?? null;
      } catch (t) {
        y.value = t instanceof Error ? t.message : "Could not load the scenario", r.value = null;
      }
    }
    function T() {
      r.value && (n("submit", r.value), n("provenance", { action: "load_scenario", target_kind: "case", target_id: r.value.case_id }));
    }
    function N() {
      U.value = !0, M.value && (n("submit", I(k.value, g.value, L)), n("provenance", { action: "create_case", target_kind: "case" }));
    }
    return (a, t) => (i(), u("div", W, [
      e.title ? (i(), u("h2", X, v(e.title), 1)) : p("", !0),
      e.subtitle ? (i(), u("p", Y, v(e.subtitle), 1)) : p("", !0),
      P.value ? (i(), u("div", Z, [
        o("button", {
          type: "button",
          class: w({ active: b.value === "scenario" }),
          onClick: t[0] || (t[0] = (l) => b.value = "scenario")
        }, " Prepared scenarios ", 2),
        o("button", {
          type: "button",
          class: w({ active: b.value === "custom" }),
          onClick: t[1] || (t[1] = (l) => b.value = "custom")
        }, " Own case ", 2)
      ])) : p("", !0),
      b.value === "scenario" ? (i(), u("div", ee, [
        o("label", te, [
          t[5] || (t[5] = o("span", null, "Scenario", -1)),
          h(o("select", {
            "onUpdate:modelValue": t[2] || (t[2] = (l) => C.value = l),
            disabled: _.value,
            onChange: B
          }, [
            o("option", ae, v(_.value ? "Loading…" : "Select a scenario…"), 1),
            (i(!0), u(S, null, E(m.value, (l) => (i(), u("option", {
              key: l.case_id,
              value: l.case_id
            }, v(l.title), 9, le))), 128))
          ], 40, se), [
            [q, C.value]
          ])
        ]),
        y.value ? (i(), u("div", oe, v(y.value), 1)) : p("", !0),
        r.value ? (i(), u("div", ne, [
          o("h3", null, v(r.value.title), 1),
          o("p", null, v(r.value.fact_pattern), 1),
          o("div", ie, [
            (i(!0), u(S, null, E(O.value, (l) => (i(), u("span", {
              key: l.key,
              class: "fact-chip"
            }, [
              o("b", null, v(l.label) + ":", 1),
              z(" " + v(l.value), 1)
            ]))), 128))
          ])
        ])) : p("", !0),
        o("div", ue, [
          o("button", {
            type: "button",
            class: "primary",
            disabled: !r.value,
            onClick: T
          }, " Use this case ", 8, ce)
        ])
      ])) : (i(), u("div", re, [
        o("label", de, [
          t[6] || (t[6] = o("span", null, "Case title", -1)),
          h(o("input", {
            "onUpdate:modelValue": t[3] || (t[3] = (l) => k.value = l),
            type: "text",
            placeholder: "e.g. Halden Biocatalysis"
          }, null, 512), [
            [V, k.value]
          ])
        ]),
        o("label", ve, [
          t[7] || (t[7] = o("span", null, "Fact pattern", -1)),
          h(o("textarea", {
            "onUpdate:modelValue": t[4] || (t[4] = (l) => g.value = l),
            rows: "5",
            placeholder: "Describe the factual situation…"
          }, null, 512), [
            [V, g.value]
          ])
        ]),
        e.factFields && e.factFields.length ? (i(), u("div", me, [
          (i(!0), u(S, null, E(e.factFields, (l) => (i(), u("label", {
            key: l.key,
            class: "field fact-field"
          }, [
            o("span", null, v(l.label ?? l.key), 1),
            h(o("input", {
              "onUpdate:modelValue": (j) => L[l.key] = j,
              type: "text",
              placeholder: l.placeholder ?? ""
            }, null, 8, _e), [
              [V, L[l.key]]
            ])
          ]))), 128))
        ])) : p("", !0),
        !M.value && U.value ? (i(), u("div", fe, " A title and a fact pattern are required. ")) : p("", !0),
        o("div", { class: "actions" }, [
          o("button", {
            type: "button",
            class: "primary",
            onClick: N
          }, "Use this case")
        ])
      ]))
    ]));
  }
}), be = (s, d) => {
  const e = s.__vccOpts || s;
  for (const [c, n] of d)
    e[c] = n;
  return e;
}, ye = /* @__PURE__ */ be(pe, [["__scopeId", "data-v-18a04973"]]), ge = {
  install(s) {
    s.component("LegalCaseForm", ye);
  }
};
export {
  ke as CUSTOM_CASE_ID,
  D as FormType,
  ye as LegalCaseForm,
  ge as VueLegalCaseBuilderPlugin,
  I as buildCustomCase,
  ge as default,
  R as factEntries,
  J as isCustomCaseValid,
  x as summaryToCase
};
