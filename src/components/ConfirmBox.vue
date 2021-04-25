

<template>
<div class="confirmbox">
    <div class="checkbox">
      <BCheckbox v-model="internalModel"></BCheckbox>
    </div>
    <div class="text">
      <slot></slot>
    </div>
</div>
</template>

<script setup>
export default {
  name: 'ConfirmBox',
  props: ["model"],
  data() {
    return {
      internalModel: this.model
    };
  },
  watch: {
    internalModel() {
      this.$emit("input", this.internalModel);
    }
  }
}
</script>

<style lang="scss" scoped>
.confirmbox {
  display: flex;
  align-content: flex-start;

  .checkbox {
    padding-top: 1px;
  }

  .text {
    color: rgb(48, 48, 48);
    font-size: 14px;
  }
}
</style>
