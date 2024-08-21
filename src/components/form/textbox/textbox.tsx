import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from 'react';
import FormField from '~/components/form/form_field';
import FormFieldError from '~/components/form/form_field_error';
import Input from '~/components/form/input';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label?: string;
  value?: string;
  errors?: string[];
  onChange?: (name: string, value: string) => void;
  formFieldClassname?: string;
}

export default function TextBox({
  name,
  label,
  value = '',
  errors = [],
  onChange,
  required = false,
  formFieldClassname,
  ...props
}: InputProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>(value);

  const _onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInputValue(target.value);
    if (onChange) {
      onChange(target.name, target.value);
    }
  };

  // Update internal state when value props change
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <FormField className={formFieldClassname} required={required}>
      {label && (
        <label htmlFor={name} title={label}>
          {label}
        </label>
      )}
      <Input
        {...props}
        name={name}
        onChange={_onChange}
        value={inputValue}
        placeholder={props.placeholder || label || 'Type something...'}
      />
      {errors.length > 0 &&
        errors.map((error) => (
          <FormFieldError key={error}>{error}</FormFieldError>
        ))}
    </FormField>
  );
}
