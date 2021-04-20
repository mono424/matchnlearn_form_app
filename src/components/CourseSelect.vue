

<template>
<div class="courseselect">
    <BTaginput
      v-model="model"
      :data="filteredCourses"
      ellipsis
      icon="label"
      autocomplete
      :allow-new="false"
      :open-on-focus="true"
      placeholder="Add your courses"
      aria-close-label="Delete this course"
      @typing="getFilteredCourses"
      @add="() => getFilteredCourses('')"
    >
    </BTaginput>
</div>
</template>

<script setup>
const allCourses = [
  "GAD",
  "EIST",
  "Lineare Algebra",
  "Cost Accounting",
  "ERM",
  "Operations Research",
  "Grundlagen Rechnernetze und verteilte Systeme",
  "Business Law 2",
  "WPR 2",
  "Math 2",
  "IM4BDM",
  "Econ 2",
  "Production and Logistics",
];

export default {
  name: 'CourseSelect',
  props: ["model"],
  data: () => ({
    search: "",
    courses: allCourses,
  }),
  computed: {
    filteredCourses() {
      let { search, model = [] } = this;
      return allCourses
        .filter(c => model.indexOf(c) < 0)
        .filter(c => search == "" || c !== c.replace(search, ""))
    }
  },
  methods: {
    getFilteredCourses(s) {
      this.search = s;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
