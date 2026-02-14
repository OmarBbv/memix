import * as React from "react"
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mask?: string;
  onChange?: (event: { target: { name: string; value: string } }) => void;
  value?: string;
  name?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, mask = "(000) 000 00 00", onChange, name, ...props }, ref) => {
    return (
      <IMaskInput
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-zinc-50 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        mask={mask}
        radix="."
        unmask={false}
        ref={ref as any}
        inputRef={ref as any}
        onAccept={(value: any) => onChange?.({ target: { name: name || '', value } })}
        spellCheck="false"
        autoComplete="off"
        {...props}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
