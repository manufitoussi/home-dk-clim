<script module lang="ts">
  export const MODES = {
    'cold': ThermometerSnowflake,
    'hot': ThermometerSun,
  };
</script>

<script lang="ts">
  import {
    ThermometerSun,
    ThermometerSnowflake,
    Thermometer 
  } from 'lucide-svelte';

  interface ConditionModeProps {
    mode: 'cold' | 'hot';
    size?: string | number | undefined;
    className?: string; 
  }

  const { mode, size, className, ...others} : ConditionModeProps = $props();
  let TheIcon = $derived(MODES[mode as keyof typeof MODES] || Thermometer);
</script>

<TheIcon {size} class={className} {...others} />
