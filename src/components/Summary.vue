<template>
<div class="summary">
    <LottieAnimation
      path="assets/animations/check.json"
      :loop="false"
      :autoPlay="true"
      :height="264"
    />
    <h2>Well Done!</h2>
    <div class="content">
      You have been successfully signed up. After our algorithm has matched you with other students, you will be automatically added to a WhatsApp-Group.
    </div>
</div>
</template>

<script setup>
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
export default {
  name: 'Summary',
  props: [],
  components: {
    LottieAnimation,
  }
}
</script>

<style lang="scss" scoped>
.summary {

  padding: 50px 0;
  
  h2 {
    margin: 10px 0 50px 0;
    font-size: 46px;
    font-weight: normal;
    text-align: center;
  }

  .content {
    color: rgb(83, 83, 83);
    text-align: center;
    padding: 0 60px;
  }
}
</style>
