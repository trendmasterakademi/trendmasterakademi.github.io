import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standard Button component supporting 3 brand styles:
 * - 'primary': Solid --accent, white text, hover:brightness-90, min-h-[44px]
 * - 'secondary': Transparent bg, 1px --rule border, --ink text, hover:bg-[var(--paper)], min-h-[44px]
 * - 'link': Underlined --accent-ink, min-h-[44px] touch target
 */
export default function Button({
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  let baseClass = 'btn-primary';
  if (variant === 'secondary') {
    baseClass = 'btn-secondary';
  } else if (variant === 'link') {
    baseClass = 'btn-link';
  }

  const combinedClass = `${baseClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClass} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
