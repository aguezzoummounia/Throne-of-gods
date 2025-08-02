"use client";

import * as React from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted
    ? createPortal(
        <>{children}</>,
        document.querySelector("#popup-portal") as Element
      )
    : null;
};

export default Portal;
