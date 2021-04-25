

<template>
<div class="radiogroup">
    <div v-for="item in items" class="item" :key="item.value">
        <BRadio
          v-model="internalModel"
          :nativeValue="item.value">
          {{item.title}}
        </BRadio>
    </div>
</div>
</template>

<script setup>
export default {
  name: 'StudyYearSelect',
  props: ["items", "model"],
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
.radiogroup {
  .item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
