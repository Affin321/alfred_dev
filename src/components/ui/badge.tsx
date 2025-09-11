// src/components/ui/badge.tsx

import React from 'react';

// Utility function to combine classes
const combineClasses = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Badge variant styles
const badgeVariants = {
  variant: {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    outline: "text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-100",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
    info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    ghost: "border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  },
  size: {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },
  interactive: {
    true: "cursor-pointer select-none",
    false: "cursor-default",
  }
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: keyof typeof badgeVariants.variant;
  size?: keyof typeof badgeVariants.size;
  interactive?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  removable?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  variant = 'default',
  size = 'default',
  interactive,
  children,
  onRemove,
  icon,
  removable = false,
  onClick,
  ...props
}, ref) => {
  const isInteractive = interactive || onClick || removable;

  return (
    <div
      ref={ref}
      className={combineClasses(
        // Base styles
        "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        // Size styles
        badgeVariants.size[size],
        // Variant styles
        badgeVariants.variant[variant],
        // Interactive styles
        isInteractive ? badgeVariants.interactive.true : badgeVariants.interactive.false,
        // Custom className
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-1 flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-white/20 focus:outline-none"
          aria-label="Remove"
        >
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

Badge.displayName = "Badge";

export { Badge };