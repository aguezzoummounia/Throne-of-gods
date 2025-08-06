"use client";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
// whitespace-nowrap
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal break-words text-sm font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 backdrop-blur-xl transition-colors group cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(0,0,0,.05)] text-primary-foreground shadow-sm hover:opacity-70",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 has-[>svg]:px-3 [&>span]:py-2",
        sm: "h-8 px-3 has-[>svg]:px-2.5",
        lg: "h-11 px-8 has-[>svg]:px-4",
        icon: "h-10 w-10",
        loose: "h-auto px-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: undefined;
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    });

type Props = ButtonProps &
  VariantProps<typeof buttonVariants> & {
    animated?: boolean;
    className?: string;
    children: React.ReactNode;
  };

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (
    { size, href, variant, children, className, animated = false, ...props },
    ref
  ) => {
    const classNames = cn(buttonVariants({ variant, size }), className);
    const borders = (
      <>
        <img
          src="/cropped-border.png"
          alt=""
          className="absolute left-0 bottom-full h-auto pointer-events-none z-0 rotate-180 translate-y-[2px]"
        />
        <img
          src="/cropped-border.png"
          alt=""
          className="absolute left-0 top-full w-full h-auto pointer-events-none z-0 -translate-y-[2px]"
        />
      </>
    );

    const content = animated ? (
      <div className="inline-block relative h-full overflow-hidden z-10 gap-0">
        <span className="flex items-center h-full transform transition duration-500 ease-out group-hover:-translate-y-full">
          {children}
        </span>
        <span className="flex items-center h-full transform transition duration-500 ease-out group-hover:-translate-y-full">
          {children}
        </span>
      </div>
    ) : (
      <span className="relative z-10">{children}</span>
    );

    if (href) {
      return (
        <Link
          href={href}
          data-slot="button"
          className={classNames}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
          {borders}
        </Link>
      );
    }

    return (
      <button
        data-slot="button"
        className={classNames}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
        {borders}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
