

<template>
<div class="radiogroup">
    <div v-for="item in items" class="item" :key="item.value">
        <b-radio
          v-model="model"
          :nativeValue="item.value">
          {{item.title}}
        </b-radio>
    </div>
</div>
</template>

<script setup>
export default {
  name: 'StudyYearSelect',
  props: ["items", "model"],
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
