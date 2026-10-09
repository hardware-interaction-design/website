export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'compact';

export function buttonClasses(variant: ButtonVariant, size: ButtonSize) {
  return ['button', `button-${variant}`, `button-${size}`];
}
