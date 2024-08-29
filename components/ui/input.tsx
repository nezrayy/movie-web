import * as React from "react";

import { cn } from "@/lib/utils";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [expanded, setExpanded] = useState<boolean>(true);

    return (
      <input
        type={type}
        className={cn(
          `bg-[#21212E] flex h-14 w-full rounded-md px-4 text-sm ring-offset-background file:bg-transparent file:text-sm file:font-medium caret-white placeholder:text-white placeholder:font-normal focus:ring-[#414164] focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
    ${expanded ? "" : "w-0"}`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
