export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
export type ButtonSize = 'default' | 'compact';

export function buttonClasses(variant: ButtonVariant, size: ButtonSize) {
  return ['button', `button-${variant}`, `button-${size}`];
}
