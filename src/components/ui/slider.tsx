"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean;
}

const Slider = React.forwardRef<HTMLElement, SliderProps>(
  ({ className, showTooltip = false, defaultValue = [3], ...props }, ref) => {
    const [value, setValue] = React.useState<number[]>(
      defaultValue as number[]
    );
    const [showTooltipState, setShowTooltipState] = React.useState(false);

    const handlePointerDown = () => {
      setShowTooltipState(true);
    };

    const handlePointerUp = () => {
      setShowTooltipState(false);
    };

    React.useEffect(() => {
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }, []);

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        min={1}
        max={30}
        step={1}
        value={value}
        onValueChange={setValue}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-[#E5573F]" />
        </SliderPrimitive.Track>
        <TooltipProvider>
          <Tooltip open={showTooltip && showTooltipState}>
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb
                className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onMouseEnter={() => setShowTooltipState(true)}
                onMouseLeave={() => setShowTooltipState(false)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#E5573F] text-white text-sm rounded px-2 py-1 border-none">
              <p>{value[0]} days</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName as string;

export { Slider };
