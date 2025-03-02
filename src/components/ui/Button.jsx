import * as React from "react";

export const Button = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg  bg text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
