import * as React from "react";
import { cn } from "../../lib/utils";

interface AlertDialogProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialog = ({ children, className }: AlertDialogProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
};

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AlertDialogTrigger = ({ children, className, onClick }: AlertDialogTriggerProps) => {
  return (
    <button 
      className={cn("inline-flex items-center justify-center", className)} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const AlertDialogContent = ({ children, className, onClose }: AlertDialogContentProps) => {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        {children}
        {onClose && (
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogHeader = ({ children, className }: AlertDialogHeaderProps) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogTitle = ({ children, className }: AlertDialogTitleProps) => {
  return (
    <h2 className={cn("text-xl font-semibold", className)}>
      {children}
    </h2>
  );
};

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogDescription = ({ children, className }: AlertDialogDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  );
};

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogFooter = ({ children, className }: AlertDialogFooterProps) => {
  return (
    <div className={cn("flex justify-end space-x-2 mt-4", className)}>
      {children}
    </div>
  );
};

interface AlertDialogActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AlertDialogAction = ({ children, className, onClick }: AlertDialogActionProps) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface AlertDialogCancelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AlertDialogCancel = ({ children, className, onClick }: AlertDialogCancelProps) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
};
