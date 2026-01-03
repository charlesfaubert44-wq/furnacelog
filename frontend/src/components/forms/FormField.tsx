import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  helperText?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  helperText,
  required,
  className,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-flame-red-600 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        error={!!error}
        {...register(name)}
        {...props}
      />
      {helperText && !error && (
        <p className="text-micro text-aluminum-500">{helperText}</p>
      )}
      {error && (
        <p className="text-micro text-flame-red-600 flex items-center gap-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
