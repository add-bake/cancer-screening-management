<template>
  <div class="wrapper" :style="{'background-color': color}">
    <div class="icon-wrapper">
      <icon-svg class="pad" icon-class="pad"></icon-svg>
      <icon-svg class="on-top" :icon-class="icon"></icon-svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: String,
    icon: String
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  border-radius: 8px;
  padding: 25px 30px;
}
.icon-wrapper {
  width: 70px;
  height: 70px;
  position: relative;
}
.pad {
  color: hsla(0, 100%, 100%, 0.5);
  font-size: 70px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.2));
}
.on-top {
  color: #fff;
  font-size: 40px;
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>
