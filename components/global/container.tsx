import { cn } from "@/lib/utils";
import React, { ReactNode, forwardRef, ComponentPropsWithRef } from "react";

type AllowedTags = "div" | "section" | "aside" | "main";

// Define the generic props for our component. This is the "ideal" props
// interface we want for the consumer of our component.
type ContainerProps<T extends AllowedTags> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

// Define the type for the component's signature.
// This describes a generic, forward-ref-enabled component.

type ContainerComponent = (<T extends AllowedTags = "div">(
  props: ContainerProps<T> & {
    ref?: React.ForwardedRef<HTMLElementTagNameMap[T]>;
  }
) => React.ReactElement | null) & { displayName?: string };

// Implement the component. The function inside forwardRef is NOT generic
// itself to avoid TypeScript inference issues. We use safe base types.
const ContainerRaw = forwardRef<
  HTMLElement,
  { as?: AllowedTags; children: ReactNode; [key: string]: any }
>(({ as, children, className, ...restProps }, ref) => {
  const Component = as || "div";

  return (
    <Component
      ref={ref}
      {...restProps}
      className={cn("min-h-svh px-12 max-md:px-5 md:py-10 py-8", className)}
    >
      {children}
    </Component>
  );
});

/**
 * A flexible layout container component that can be rendered as a 'div',
 * 'section', 'aside', or 'main' element. It forwards refs and accepts all
 * valid HTML attributes for the specified element type.
 */
const Container: ContainerComponent = ContainerRaw as ContainerComponent;

Container.displayName = "Container";

export default Container;
