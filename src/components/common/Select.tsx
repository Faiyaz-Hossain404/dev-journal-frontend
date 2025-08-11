type Options = { label: string; value: string };

type SelectProps = {
  id?: string;
  name?: string;
  value: string | string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Options[];
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  size?: number;
};

export default function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  className,
  multiple = false;
  size,
}: SelectProps) {
  const selectValue = multiple ? (Array.isArray(value) ? value : []) : (typeof value === "string" ? value: "");
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
