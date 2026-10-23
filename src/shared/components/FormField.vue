<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>
<template>
  <div class="field">
    <label :for="id">{{ label }} <span v-if="required">（必填）</span></label
    ><input
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    /><small v-if="hint" :id="`${id}-hint`" class="muted">{{ hint }}</small>
  </div>
</template>
<style scoped>
.field {
  min-width: 0;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
}
</style>
