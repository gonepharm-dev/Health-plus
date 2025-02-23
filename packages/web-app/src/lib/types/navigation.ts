import type { ComponentType } from 'svelte';
import type { SvelteComponent } from 'svelte';
import type { IconProps } from 'lucide-svelte';

export type NavigationItem = {
  href: string;
  label: string;
  icon: ComponentType<SvelteComponent<IconProps>>;
  roles?: Array<'doctor' | 'patient'>;
};