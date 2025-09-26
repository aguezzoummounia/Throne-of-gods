import { cn } from "@/lib/utils";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";
import { useCallback } from "react";

interface MenuToggleProps {
  open: boolean;
  handleClick: () => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

const MenuToggle: React.FC<MenuToggleProps> = ({
  open,
  handleClick,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
}) => {
  const soundEvents = useInteractiveSound();

  const handleToggleClick = useCallback(() => {
    soundEvents.onClick();
    handleClick();
  }, [soundEvents, handleClick]);

  return (
    <button
      type="button"
      {...soundEvents}
      onClick={handleToggleClick}
      className="cursor-pointer md:hidden flex items-center justify-center px-1 w-7 h-7 transition-colors duration-200 hover:text-primary/80"
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={ariaExpanded ?? open}
      aria-controls={ariaControls}
      aria-haspopup="true"
    >
      <div className="relative w-5 h-5" aria-hidden="true">
        <span
          className={cn(
            "absolute block h-[1.5px] w-[20px] transform bg-current transition-all duration-300 ease-in-out rounded-[2px] top-1/2 left-1/2 -translate-x-1/2",
            open ? "rotate-45 -translate-y-1/2" : "-translate-y-[5px]"
          )}
        />
        <span
          className={cn(
            "absolute block h-[1.5px] w-[20px] transform bg-current transition-all duration-300 ease-in-out rounded-[2px] top-1/2 left-1/2 -translate-x-1/2",
            open ? "-rotate-45 -translate-y-1/2" : "translate-y-[3px]"
          )}
        />
      </div>
    </button>
  );
};

export default MenuToggle;
