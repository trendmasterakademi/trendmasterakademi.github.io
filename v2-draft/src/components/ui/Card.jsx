import React from 'react';

/**
 * Standard Card component:
 * - Surface: bg-[var(--surface)]
 * - Border: 1px solid var(--rule)
 * - Radius: var(--r-panel) (10px)
 * - Padding: p-5 sm:p-6
 * - Baseline & flex consistency
 */
export default function Card({
  as: Component = 'div',
  variant = 'default',
  className = '',
  children,
  ...props
}) {
  let variantClass = 'bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)]';
  if (variant === 'muted') {
    variantClass = 'bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)]';
  } else if (variant === 'accent') {
    variantClass = 'bg-[var(--accent-wash)] border border-[var(--accent)]/30 text-[var(--ink)]';
  } else if (variant === 'terminal') {
    variantClass = 'bg-[var(--term-bg)] border border-[var(--rule)] text-[var(--term-ink)]';
  }

  const combinedClass = `rounded-[var(--r-panel)] p-5 sm:p-6 transition-colors ${variantClass} ${className}`.trim();

  return (
    <Component className={combinedClass} {...props}>
      {children}
    </Component>
  );
}
