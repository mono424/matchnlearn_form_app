<template>
<div class="radiomatrix">
    <table>
      <thead>
        <tr>
          <td></td>
          <td v-for="col in cols" :key="col.value">{{col.title}}</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.value">
          <td>{{row.title}}</td>
          <td v-for="col in cols" :key="col.value">
            <BRadio v-model="internalModel[row.value]" :nativeValue="col.value"></BRadio>
          </td>
        </tr>
      </tbody>
    </table>
</div>
</template>

<script setup>
export default {
  name: 'RadioMatrixMulti',
  props: ["rows", "cols", "model"],
  data() {
    return {
      internalModel: (this.model || {}),
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
.radiomatrix {

  table, th, td {
    border-bottom: 4px solid white;
  }

  thead {
    font-size: 14px;
  }

  tbody {
    tr {
      background: #f8f9fa;

      td {
        text-align: center;

        &:first-child {
          font-size: 14px;
          text-align: left;
        }
      }
    }
  }
}
</style>
