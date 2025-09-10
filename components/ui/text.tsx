import { cn } from "@/lib/utils";
import {
  forwardRef,
  ElementType,
  ReactElement,
  ForwardedRef,
  ComponentPropsWithRef,
  ReactNode,
  ComponentPropsWithoutRef,
} from "react";
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

// works with react 19, cause u can just pass the ref
// type TextOwnProps = VariantProps<typeof titleVariants> & {
//   children: React.ReactNode;
//   className?: string;
// };

// type TextProps<T extends ElementType> = TextOwnProps & {
//   as?: T;
//   ref?: React.ComponentPropsWithRef<T>["ref"];
// } & Omit<React.ComponentPropsWithoutRef<T>, keyof TextOwnProps | "as" | "ref">;

// const Text = <T extends ElementType = "span">({
//   as,
//   ref,
//   color,
//   width,
//   variant,
//   children,
//   className,
//   ...rest
// }: TextProps<T>) => {
//   const Component = as || "span";

//   return (
//     <Component
//       ref={ref as any} // Type assertion to handle cases where T may not accept ref
//       className={cn(titleVariants({ variant, width, color }), className)}
//       {...(rest as any)} // Type assertion to resolve the error
//     >
//       {children}
//     </Component>
//   );
// };

// export default Text;

// for react 18

// Type definitions for props (These are correct)
type TextOwnProps<T extends ElementType> = VariantProps<
  typeof titleVariants
> & {
  children: ReactNode;
  className?: string;
  as?: T;
};

type TextProps<T extends ElementType> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

// The public-facing type for our component.
type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];
type PolymorphicComponentProps<C extends ElementType> = TextProps<C> & {
  ref?: PolymorphicRef<C>;
};

type PolymorphicComponent = <C extends ElementType = "span">(
  props: PolymorphicComponentProps<C>
) => ReactElement | null;

// --- IMPLEMENTATION ---

// 1. The inner render function.
const TextInner = <T extends ElementType = "span">(
  props: TextProps<T>,
  ref: ForwardedRef<unknown> // The ref type from forwardRef is necessarily generic
) => {
  const {
    as: Component = "span",
    color,
    width,
    variant,
    children,
    className,
    ...rest
  } = props;

  return (
    <Component
      // 2. THIS IS THE FIX: We add `as any` to the ref prop.
      // We know from the outer component's signature that the ref will be
      // of the correct type, but TS can't figure that out here.
      ref={ref as any}
      className={cn(titleVariants({ variant, width, color }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

// 3. We use `as any` on the function passed to forwardRef to bypass
//    the initial inference bug that causes misleading errors.
const TextComponent = forwardRef(TextInner as any);

// 4. Add the display name for better React DevTools debugging.
if (process.env.NODE_ENV !== "production") {
  TextComponent.displayName = "Text";
}

// 5. Export the component, casting the result to our perfect, strongly-typed
//    `PolymorphicComponent` type. This ensures consumers of your component
//    get full type safety.
export const Text = TextComponent as PolymorphicComponent;

export default Text;
