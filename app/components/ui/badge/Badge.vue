<script setup lang="ts">
/**
 * 🌊 Badge - Marine Themed
 *
 * Badge component with ocean-inspired variants.
 */
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  class?: string;
}

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        ocean: 'border-transparent bg-gradient-ocean text-white shadow',
        coral: 'border-transparent bg-gradient-coral text-white shadow',
        seafoam: 'border-transparent bg-seafoam text-primary shadow',
      },
    },
  },
  {
    defaultVariants: {
      variant: 'default',
    },
  },
);

const props = defineProps<BadgeProps>();
</script>

<template>
  <div :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
