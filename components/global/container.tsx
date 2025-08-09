import { cn } from "@/lib/utils";
import { ElementType, ReactNode } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Container = <T extends ElementType = "div">({
  children,
  className = "",
  as: Component = "div" as any,
  ...props
}: ContainerProps<T>) => {
  return (
    <Component
      // md:pt-30 pt-16
      className={cn("min-h-svh px-12 max-md:px-5 md:py-10 py-8", className)}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

export default Container;
