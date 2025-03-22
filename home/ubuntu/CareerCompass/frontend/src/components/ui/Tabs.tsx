import * as React from "react";
import { cn } from "../../lib/utils";

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, defaultValue, value, onValueChange, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div
      ref={ref}
      className={cn("inline-flex", className)}
      {...props}
      data-selected-value={selectedValue}
    />
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string;
  }
>(({ className, value, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tabsElement = event.currentTarget.closest("[data-selected-value]") as HTMLElement;
    const onValueChange = tabsElement?.getAttribute("data-selected-value") !== value 
      ? () => {
          const closestTabs = event.currentTarget.closest("[data-selected-value]") as HTMLElement;
          if (closestTabs) {
            const customEvent = new CustomEvent("tabChange", {
              detail: { value },
              bubbles: true,
            });
            closestTabs.dispatchEvent(customEvent);
            closestTabs.setAttribute("data-selected-value", value);
          }
        }
      : undefined;

    if (onValueChange) {
      onValueChange();
    }

    if (props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-background text-foreground shadow-sm": 
            event => (event.currentTarget.closest("[data-selected-value]") as HTMLElement)?.getAttribute("data-selected-value") === value,
          "hover:text-foreground": 
            event => (event.currentTarget.closest("[data-selected-value]") as HTMLElement)?.getAttribute("data-selected-value") !== value,
        },
        className
      )}
      {...props}
      onClick={handleClick}
      data-value={value}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
  }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      {
        "hidden": event => (event.currentTarget.closest("[data-selected-value]") as HTMLElement)?.getAttribute("data-selected-value") !== value,
      },
      className
    )}
    {...props}
    data-value={value}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
