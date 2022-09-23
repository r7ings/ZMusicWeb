<template>
  <div>{{ index }}</div>
</template>

<script>
export default {
  data() {
    return {
      index: this.$route.query.index,
    };
  },
  watch: {
    $route: {
      handler() {
        this.index = this.$route.query.index;
      },
    },
  },
};
</script>

<style>
</style>