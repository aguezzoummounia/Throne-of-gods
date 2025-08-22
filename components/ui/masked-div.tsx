import { cn } from "@/lib/utils";

interface MaskedDivComponentProps {
  className?: string;
  children: React.ReactNode;
}

const MaskedDivComponent: React.FC<MaskedDivComponentProps> = ({
  children,
  className,
}) => {
  const svgMask = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 200 200"><path fill="#000000" d="M45.7,-9.8C54.5,12.1,53.5,42.2,34.6,58.5C15.6,74.8,-21.2,77.3,-40.2,62C-59.1,46.6,-60.2,13.4,-50.5,-9.8C-40.8,-33,-20.4,-46,-1,-45.7C18.5,-45.4,37,-31.7,45.7,-9.8Z" transform="translate(100 100)"/></svg>`;

  // We use encodeURIComponent to handle special characters.
  const encodedSvg = encodeURIComponent(svgMask);

  // 3. Create the data URI.
  const maskDataUri = `url("data:image/svg+xml,${encodedSvg}")`;

  // 4. Define the mask styles.
  const maskStyles = {
    maskImage: maskDataUri,
    WebkitMaskImage: maskDataUri, // For Safari and older Chrome

    maskSize: "100% 100%", // Or 'cover', '100% 100%', etc.
    WebkitMaskSize: "100% 100%",

    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",

    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <div
      style={{
        ...maskStyles,
      }}
      className={cn("size-[300px] rotate-scale", className)}
    >
      {children}
    </div>
  );
};

export default MaskedDivComponent;
