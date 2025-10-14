"use client";

import * as React from "react";
import { cn } from "./utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("overflow-y-auto overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ScrollBar() {
  // This is kept for compatibility but does nothing with native scroll
  return null;
}

export { ScrollArea, ScrollBar };
