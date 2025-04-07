"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface AutocompleteOption {
  value: string;
  label: string;
  disable?: boolean;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  placeholder?: string;
  selected: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  name?: string;
  clearable?: boolean;
  navbar?: boolean;
  maxItemsToShow?: number;
}

export function Autocomplete({
  options,
  placeholder = "Search...",
  selected,
  onChange,
  className,
  id,
  name,
  clearable = true,
  navbar = false,
  maxItemsToShow = 7, // Default to show up to 7 items before scrolling
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [isMounted, setIsMounted] = React.useState(false);

  // Set mounted state for client-side rendering
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  // Calculate dropdown height based on number of items
  const calculateDropdownHeight = (itemCount: number): number => {
    // Base values: item height plus padding
    const itemHeight = 36; // px (based on py-2 + text-sm)
    const headerHeight = 0; // If there's any header
    const footerHeight = 0; // If there's any footer
    const paddingHeight = 4; // px (top + bottom padding)

    // Calculate height for visible items (up to maxItemsToShow)
    const visibleItems = Math.min(itemCount, maxItemsToShow);
    const contentHeight =
      visibleItems * itemHeight + headerHeight + footerHeight + paddingHeight;

    // If no items, show minimum height for "No results found"
    return itemCount === 0 ? 40 : contentHeight;
  };

  // Update dropdown position based on input element
  const updatePosition = React.useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate dropdown height based on filtered options
      const dropdownHeight = calculateDropdownHeight(filteredOptions.length);

      // Check if dropdown would go off screen at the bottom
      const windowHeight = window.innerHeight;
      const bottomSpace = windowHeight - rect.bottom;
      const wouldOverflowBottom = dropdownHeight > bottomSpace;

      // If it would overflow, position above the input instead
      const positionAbove = wouldOverflowBottom && rect.top > dropdownHeight;

      // Use viewport-relative positioning (no scroll offsets)
      setPosition({
        top: positionAbove ? rect.top - dropdownHeight : rect.bottom,
        left: rect.left,
        width: rect.width,
        height: dropdownHeight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOptions.length]);

  // Update position when open state changes, input value changes, or on window resize/scroll
  React.useEffect(() => {
    if (open && containerRef.current) {
      updatePosition();

      // Update position on resize and scroll events
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [open, inputValue, updatePosition]);

  // Set input value when selected changes from outside
  React.useEffect(() => {
    if (selected) {
      const selectedOption = options.find(
        (option) => option.value === selected
      );
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    } else {
      setInputValue("");
    }
  }, [selected, options]);

  // Handle outside clicks to close dropdown
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".autocomplete-dropdown")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!open) setOpen(true);

    // If input is cleared, also clear the selected value
    if (newValue === "" && selected) {
      onChange("");
    }

    // Ensure position updates when input changes
    if (open) {
      updatePosition();
    }
  };

  const handleSelectOption = (value: string) => {
    const option = options.find((option) => option.value === value);
    if (option) {
      setInputValue(option.label);
      onChange(value);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");

    // Ensure dropdown updates after clearing
    if (open) {
      setTimeout(updatePosition, 0);
    }
  };

  const renderDropdown = () => {
    if (!open || !isMounted) return null;

    const dropdown = (
      <div
        className="autocomplete-dropdown fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto "
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          maxHeight: `${position.height}px`,
          zIndex: navbar ? 9999 : 9998, // Ensure dropdown is above navbar
        }}
      >
        {filteredOptions.length > 0 ? (
          <ul className="py-1">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelectOption(option.value)}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  selected === option.value && "bg-gray-100 font-medium",
                  option.disable && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  {option.label}
                  {selected === option.value && <Check className="h-4 w-4" />}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-2 text-sm text-gray-500">No results found</div>
        )}
      </div>
    );

    return createPortal(dropdown, document.body);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="flex items-center relative">
        <Input
          id={id}
          name={name}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setOpen(true);
            updatePosition();
          }}
          className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
          autoComplete="off"
          aria-autocomplete="none"
        />
        {clearable && selected && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="absolute right-1 h-full px-2 py-0 hover:bg-transparent"
            type="button"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-900" />
          </Button>
        )}
      </div>
      {renderDropdown()}
    </div>
  );
}
