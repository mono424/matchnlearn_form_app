

<template>
<div class="courseselect">
    <BTaginput
      v-model="internalModel"
      :data="filteredCourses"
      ellipsis
      icon="label"
      autocomplete
      :allow-new="false"
      :open-on-focus="true"
      :loading="loading"
      placeholder="Add your courses"
      aria-close-label="Delete this course"
      @typing="getFilteredCourses"
      @add="(e) => getFilteredCourses('')"
    >
    <template slot-scope="props">
        {{props.option.title}}
    </template>
    <template #selected="props">
        <BTag
            v-for="(tag, index) in props.tags"
            :key="index"
            rounded
            :tabstop="false"
            ellipsis
            closable
            @close="removeTag(index)">
            {{tag.title}}
        </BTag>
    </template>
    </BTaginput>
</div>
</template>

<script setup>
import ApiService from '../services/api';
// const allCourses = [
//   "GAD",
//   "EIST",
//   "Lineare Algebra",
//   "Cost Accounting",
//   "ERM",
//   "Operations Research",
//   "Grundlagen Rechnernetze und verteilte Systeme",
//   "Business Law 2",
//   "WPR 2",
//   "Math 2",
//   "IM4BDM",
//   "Econ 2",
//   "Production and Logistics",
// ];

export default {
  name: 'CourseSelect',
  props: ["model"],
  mounted() {
    this.updateCourses();
  },
  data() {
    return {
      search: "",
      courses: [],
      loading: true,
      internalModel: this.model
    };
  },
  watch: {
    internalModel() {
      this.$emit("input", this.internalModel);
    }
  },
  computed: {
    filteredCourses() {
      let { courses, search, model = [] } = this;
      console.log(model);
      return courses
        .filter(c => model.findIndex(x => x._id == c._id) < 0)
        .map(c => ({ ...c, title: c.names[0], _search: c.names.join() }))
        .filter(c => search == "" || c._search !== c._search.replace(search, ""))
    }
  },
  methods: {
    async updateCourses() {
      this.loading = true;
      this.courses = (await ApiService.getCourses()).data;
      this.loading = false;
    },
    getFilteredCourses(s) {
      this.search = s;
    },
    removeTag(index) {
      this.internalModel.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
