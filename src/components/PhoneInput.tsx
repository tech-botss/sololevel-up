import 'react-phone-number-input/style.css';
import PhoneInputWithCountry from 'react-phone-number-input';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "Phone number", className, disabled }, ref) => {
    return (
      <PhoneInputWithCountry
        international
        defaultCountry="US"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:text-foreground",
          "[&_.PhoneInputCountry]:mr-2",
          "[&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4",
          "[&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputCountrySelectArrow]:opacity-50",
          "[&_.PhoneInputCountrySelect]:bg-background [&_.PhoneInputCountrySelect]:text-foreground",
          className
        )}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
