import { cn } from "@/lib/utils";
import { ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Variant styles
const titleVariants = cva("font-alegreya", {
  variants: {
    variant: {
      default: "lg:text-lg md:text-xl text-lg leading-[1.1]",
      medium: "text-xl leading-[1.1]",
      title:
        "font-cinzeldecorative max-md:text-dynamic-2xl md:text-dynamic-2xl leading-[1.2]", //title
      lead: "lg:text-dynamic-lg md:text-dynamic-base max-md:text-[4vw] font-semibold leading-[1.1]", //medium title
      small: "md:text-lg text-[3.75vw] leading-[1.1]", //subtitle
      xs: "md:text-[10px] text-[3vw] leading-[1.1]", //small regular text
    },
    width: {
      default: "w-auto",
      sm: "max-w-[800px]",
    },
    color: {
      default: "text-[#fcf6e8]",
      blue: "text-[#afb9c2]",
      bronze: "text-[#796f65]",
      dark: "text-[rgba(255,255,255,0.4)]",
      lightDark: "text-[rgba(255,255,255,0.6)]",
    },
  },
  defaultVariants: {
    variant: "default",
    width: "default",
    color: "default",
  },
});

type TextOwnProps = VariantProps<typeof titleVariants> & {
  children: React.ReactNode;
  className?: string;
};

type TextProps<T extends ElementType> = TextOwnProps & {
  as?: T;
  ref?: React.ComponentPropsWithRef<T>["ref"];
} & Omit<React.ComponentPropsWithoutRef<T>, keyof TextOwnProps | "as" | "ref">;

const Text = <T extends ElementType = "span">({
  as,
  ref,
  color,
  width,
  variant,
  children,
  className,
  ...rest
}: TextProps<T>) => {
  const Component = as || "span";

  return (
    <Component
      ref={ref as any} // Type assertion to handle cases where T may not accept ref
      className={cn(titleVariants({ variant, width, color }), className)}
      {...(rest as any)} // Type assertion to resolve the error
    >
      {children}
    </Component>
  );
};

export default Text;
