<template>
  <div class="wrapper">
    <div class="title">
      {{title}}
      <div class="title-operation r">
        <slot name="titleOperation"></slot>
      </div>
    </div>
    <div class="wrap-chart">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  background-color: #fff;
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
.title {
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
  position: relative;
}
.title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background-color: #eee;
}
.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  width: 6px;
  background-color: #00a398;
}
.title-operation {
  margin-right: 40px;
}
.wrap-chart {
  padding: 20px;
}
</style>
