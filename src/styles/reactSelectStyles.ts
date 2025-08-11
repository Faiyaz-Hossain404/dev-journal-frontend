import type { StylesConfig } from "react-select";

export type SelectOption = { label: string; value: string };

export const selectStyles: StylesConfig<SelectOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#52525b" : "#3f3f46",
    boxShadow: "none",
    ":hover": { borderColor: "#52525b" },
    minHeight: 40,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
    border: "1px solid #3f3f46",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#334155"
      : state.isFocused
      ? "#374151"
      : "#1f2937",
    color: "#fff",
    cursor: "pointer",
  }),
  placeholder: (b) => ({ ...b, color: "#A8B3CF" }),
  singleValue: (b) => ({ ...b, color: "#fff" }),
  input: (b) => ({ ...b, color: "#fff" }),
  multiValue: (b) => ({ ...b, backgroundColor: "#334155" }),
  multiValueLabel: (b) => ({ ...b, color: "#fff" }),
  multiValueRemove: (b) => ({
    ...b,
    color: "#fff",
    ":hover": { backgroundColor: "#475569", color: "#fff" },
  }),
  indicatorSeparator: (b) => ({ ...b, backgroundColor: "#3f3f46" }),
  dropdownIndicator: (b) => ({ ...b, color: "#A8B3CF" }),
  clearIndicator: (b) => ({ ...b, color: "#A8B3CF" }),
};
