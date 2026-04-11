import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface TimePickerProps {
  value: string;
  invalid: boolean;
  onChange: (val: string) => void;
  isSubmitting: boolean;
}

export function TimePicker({ value, invalid, onChange, isSubmitting }: TimePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        const activeElements = scrollRef.current?.querySelectorAll('[data-selected="true"]');
        activeElements?.forEach((el) => {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      }, 100);
    }
  };

  const currentTime = value ? new Date(value) : new Date();

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-invalid={invalid}
          type="button"
          variant="outline"
          data-empty={!value}
          className="w-full justify-between font-normal data-[empty=true]:text-muted-foreground"
          disabled={isSubmitting}
        >
          {value ? format(value, "HH:mm") : "Select time"}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0">
        <div
          ref={scrollRef}
          className="flex flex-col sm:flex-row sm:h-75 divide-y sm:divide-y-0 sm:divide-x"
        >
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                const isSelected = value && new Date(value).getHours() === hour;
                return (
                  <Button
                    key={hour}
                    type="button"
                    variant={isSelected ? "default" : "ghost"}
                    className="shrink-0"
                    data-selected={isSelected}
                    onClick={() => {
                      const newDate = new Date(currentTime);
                      newDate.setHours(hour);
                      onChange(newDate.toISOString());
                    }}
                  >
                    {hour.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                const isSelected = value && new Date(value).getMinutes() === minute;
                return (
                  <Button
                    key={minute}
                    type="button"
                    variant={isSelected ? "default" : "ghost"}
                    className="shrink-0"
                    data-selected={isSelected}
                    onClick={() => {
                      const newDate = new Date(currentTime);
                      newDate.setMinutes(minute);
                      onChange(newDate.toISOString());
                    }}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
