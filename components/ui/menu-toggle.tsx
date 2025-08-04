import { cn } from "@/lib/utils";

const MenuToggle: React.FC<{ open: boolean; handleClick: () => void }> = ({
  open,
  handleClick,
}) => {
  return (
    <button
      role="button"
      title="toggle menu"
      onClick={handleClick}
      className="cursor-pointer md:hidden flex items-center px-1 w-7 h-7"
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className={cn(
            "absolute block h-[1.5px] w-[20px] transform bg-current transition-all duration-500 ease-in-out rounded-[2px]",
            open ? "rotate-45" : "-translate-y-[3.5px]"
          )}
        ></span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute block h-[1.5px] w-[20px] transform bg-current transition-all duration-500 ease-in-out rounded-[2px]",
            open ? "-rotate-45" : "translate-y-[3.5px]"
          )}
        ></span>
      </div>
    </button>
  );
};

export default MenuToggle;
