"use client";
import { Component, ReactNode, ErrorInfo } from "react";
import Text from "../ui/text";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <Text as="h3" variant="lead" className="mb-4">
                Map Unavailable
              </Text>
              <Text as="p" variant="default" color="lightDark">
                The interactive map is temporarily unavailable. Please try
                refreshing the page.
              </Text>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
