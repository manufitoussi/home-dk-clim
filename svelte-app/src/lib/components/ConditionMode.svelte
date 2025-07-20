<script module lang="ts">
  export const MODES = {
    cool: ThermometerSnowflake,
    heat: ThermometerSun,
  };
</script>

<script lang="ts">
  import type { ModeName } from '$lib';

  import {
    Thermometer,
    ThermometerSnowflake,
    ThermometerSun,
  } from 'lucide-svelte';

  interface ConditionModeProps {
    mode: ModeName;
    size?: string | number | undefined;
    className?: string;
  }

  const { mode, size, className, ...others }: ConditionModeProps = $props();
  let TheIcon = $derived(MODES[mode as keyof typeof MODES] || Thermometer);
</script>

<TheIcon {size} class={className} {...others} />
