//@ts-nocheck
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "./scroll-area";

export type ComboboxOptions = {
  label: string;
  value: string;
};

type Mode = "single" | "multiple";

interface ComboboxProps {
  mode?: Mode;
  options: ComboboxOptions[];
  selected: string | string[];
  className?: string;
  placeholder?: string;
  onChange?: (value: string | string[]) => void;
  onCreate?: (value: string) => void;
}

export function Combobox({
  options,
  selected,
  className,
  placeholder,
  mode = "single",
  onChange,
  onCreate,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<string>("auto");

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [open]);

  return (
    <div className={cn("block", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between outline-none border-none shadow-none hover:bg-white mt-1 text-sm text-black"
            onClick={() => setOpen(!open)}
          >
            <span className={selected ? "text-black" : "text-gray-500"}>
              {options.find((item) => item.value === selected)?.label ||
                placeholder ||
                "Select an option..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width }} // Dynamically set width
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              value={query}
              onValueChange={(value) => setQuery(value)}
              className="text-sm placeholder-gray-400"
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea>
              <CommandGroup>
                <CommandList>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onChange?.(option.value);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

//for normal combobox difference in the ui
//@ts-nocheck
// "use client";

// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import React from "react";
// import { ScrollArea } from "./scroll-area";

// export type ComboboxOptions = {
//   label: string;
//   value: string;
// };

// type Mode = "single" | "multiple";

// interface ComboboxProps {
//   mode?: Mode;
//   options: ComboboxOptions[];
//   selected: string | string[]; // Fix: Changed from number to string to match options
//   className?: string;
//   placeholder?: string;
//   onChange?: (value: string | string[]) => void;
//   onCreate?: (value: string) => void;
// }

// export function Combobox({
//   options,
//   selected,
//   className,
//   placeholder,
//   mode = "single",
//   onChange,
//   onCreate,
// }: ComboboxProps) {
//   const [open, setOpen] = React.useState(false);
//   const [query, setQuery] = React.useState<string>("");

//   return (
//     <div className={cn("block", className)}>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-full justify-between"
//             onClick={() => setOpen(!open)}
//           >
//             {options.find((item) => item.value === selected)?.label ||
//               placeholder ||
//               "Select an option..."}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-full max-w-sm p-0">
//           <Command>
//             <CommandInput
//               placeholder="Search..."
//               value={query}
//               onValueChange={(value) => setQuery(value)}
//             />
//             <CommandEmpty>No results found.</CommandEmpty>
//             <ScrollArea>
//               <CommandGroup>
//                 <CommandList>
//                   {options.map((option) => (
//                     <CommandItem
//                       key={option.value}
//                       value={option.value}
//                       onSelect={() => {
//                         console.log("Option selected:", option.value); // Debugging step
//                         onChange?.(option.value); // Ensure value is set
//                         setOpen(false);
//                       }}
//                     >
//                       <Check
//                         className={cn(
//                           "mr-2 h-4 w-4",
//                           selected === option.value
//                             ? "opacity-100"
//                             : "opacity-0"
//                         )}
//                       />
//                       {option.label}
//                     </CommandItem>
//                   ))}
//                 </CommandList>
//               </CommandGroup>
//             </ScrollArea>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
