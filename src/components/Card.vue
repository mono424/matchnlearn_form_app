<template>
<div :class="{ card: 1, primary }">
    <div class="topbar" v-if="primary"></div>
    <h2>{{title}} <span v-if="required" class="required">*</span></h2>
    <p v-if="description != null" class="description">{{description}}</p>
    <div class="content">
        <slot />
    </div>
</div>
</template>

<script setup>
export default {
  name: 'Card',
  props: ["title", "description", "primary", "required"],
}
</script>

<style lang="scss" scoped>
    .card {
      position: relative;
      background: white;
      border: 1px solid rgb(234 234 234);
      border-radius: 16px;
      margin: 20px 0;
      padding: 25px;

      .required {
        color: red;
      }

      .content {
        padding: 12px 0 0 0;
      }

      .topbar {
        height: 14px;
        background: rgb(113, 108, 220);
        position: absolute;
        border-radius: 16px 16px 0 0;
        top: 0;
        left: 0;
        right: 0;
      }

      .description {
        font-size: 12px;
        color: rgb(95, 95, 95);
        margin: 0 0 10px 0;
      }

      h2 {
        margin: 0 0 12px 0;
        font-size: 18px;
        font-weight: normal;
      }

      &.primary h2 {
        font-size: 32px;
        font-weight: normal;
      }
    }
</style>
