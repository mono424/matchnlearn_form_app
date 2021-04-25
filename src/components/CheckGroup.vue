<template>
<div class="checkgroup">
    <div v-for="item in items" class="item" :key="item.value">
        <BCheckbox
          @input="(state) => onChange(item.value, state)"
          :nativeValue="internalModel.findIndex((e) => e === item.value) >= 0">
          {{item.title}}
        </BCheckbox>
    </div>
</div>
</template>

<script setup>
export default {
  name: 'StudyYearSelect',
  props: ["items", "model"],
  data() {
    return {
      internalModel: this.model || []
    };
  },
  watch: {
    internalModel() {
      console.log(...this.internalModel);
      this.$emit("input", this.internalModel);
    }
  },
  methods: {
    onChange(value, state) {
      if (state) this.internalModel.push(value);
      else this.internalModel = this.internalModel.filter(e => e !== value);
    },
  }
}
</script>

<style lang="scss" scoped>
.checkgroup {
  .item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
