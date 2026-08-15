"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-dark-100 bg-white px-3 py-2 text-sm text-dark " +
  "placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold " +
  "disabled:bg-dark-50 disabled:text-dark-400";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
}

export interface InputProps
  extends FieldProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(fieldBase, error && "border-danger focus:border-danger focus:ring-danger", className)}
        {...rest}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-dark-400">{hint}</p> : null}
    </div>
  );
});

export interface TextareaProps
  extends FieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(fieldBase, "min-h-[5rem]", error && "border-danger", className)}
        {...rest}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-dark-400">{hint}</p> : null}
    </div>
  );
});

export interface SelectProps
  extends FieldProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, id, children, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={inputId}
        className={cn(fieldBase, "appearance-none bg-white pr-8", error && "border-danger", className)}
        {...rest}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-dark-400">{hint}</p> : null}
    </div>
  );
});

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex items-start gap-2">
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-dark-200 text-gold focus:ring-gold",
          className
        )}
        {...rest}
      />
      <label htmlFor={inputId} className="text-sm text-dark">
        {label}
        {description ? <span className="block text-xs text-dark-400">{description}</span> : null}
      </label>
    </div>
  );
});
