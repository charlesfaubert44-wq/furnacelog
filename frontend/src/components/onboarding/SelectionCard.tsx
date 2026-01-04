import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SelectionCardProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  className?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon: Icon,
  title,
  description,
  selected = false,
  onClick,
  disabled = false,
  badge,
  className
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "relative w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left",
        "focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
        selected && "bg-gradient-hearth border-hearth-fire shadow-glow-md",
        !selected && !disabled && "bg-warm-stone/30 border-warm-stone hover:border-honey hover:bg-warm-stone/50 hover:shadow-glow-sm",
        disabled && "opacity-40 cursor-not-allowed bg-warm-stone/10 border-warm-stone/30",
        className
      )}
    >
      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-wool-cream flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-ember-glow" strokeWidth={3} />
        </motion.div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-sunset-amber text-deep-charcoal">
            {badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all",
        selected && "bg-wool-cream/20 shadow-glow-sm",
        !selected && "bg-warm-stone/50"
      )}>
        <Icon className={cn(
          "w-6 h-6 transition-colors",
          selected ? "text-wool-cream" : "text-ember-glow"
        )} />
      </div>

      {/* Content */}
      <div>
        <h3 className={cn(
          "font-semibold text-base sm:text-lg mb-1 transition-colors",
          selected ? "text-wool-cream" : "text-wool-cream/90"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "text-sm transition-colors",
            selected ? "text-wool-cream/80" : "text-honey"
          )}>
            {description}
          </p>
        )}
      </div>
    </motion.button>
  );
};

interface SelectionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({
  children,
  columns = 3,
  className
}) => {
  return (
    <div className={cn(
      "grid gap-3 sm:gap-4",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
};

interface SelectionListProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectionList: React.FC<SelectionListProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
};

// Compact list item version
interface SelectionListItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SelectionListItem: React.FC<SelectionListItemProps> = ({
  icon: Icon,
  title,
  description,
  selected = false,
  onClick,
  disabled = false,
  className
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={cn(
        "relative w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-left",
        "focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
        "flex items-center gap-3",
        selected && "bg-gradient-hearth border-hearth-fire shadow-glow-sm",
        !selected && !disabled && "bg-warm-stone/30 border-warm-stone hover:border-honey hover:bg-warm-stone/50",
        disabled && "opacity-40 cursor-not-allowed bg-warm-stone/10 border-warm-stone/30",
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all",
        selected && "bg-wool-cream/20",
        !selected && "bg-warm-stone/50"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-colors",
          selected ? "text-wool-cream" : "text-ember-glow"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-semibold text-sm sm:text-base transition-colors",
          selected ? "text-wool-cream" : "text-wool-cream/90"
        )}>
          {title}
        </h4>
        {description && (
          <p className={cn(
            "text-xs sm:text-sm transition-colors truncate",
            selected ? "text-wool-cream/70" : "text-honey/80"
          )}>
            {description}
          </p>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-5 h-5 rounded-full bg-wool-cream flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-ember-glow" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
};

export default SelectionCard;
