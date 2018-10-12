<template>
  <div class="wrapper" :style="{'background-color': color}">
    <div class="icon-wrapper">
      <icon-svg class="pad" icon-class="pad" :style="{color: tint(color, 0.3)}"></icon-svg>
      <icon-svg class="on-top" :icon-class="icon"></icon-svg>
    </div>
    <div class="text-wrapper">
      <div class="number">{{animatedNumber}}</div>
      <div class="desc">{{desc}}</div>
    </div>
  </div>
</template>

<script>
import Color from 'color'
import TweenLite from 'gsap/TweenLite'

export default {
  props: {
    color: String,
    icon: String,
    number: Number,
    desc: String
  },
  data () {
    return {
      tweenedNumber: this.number
    }
  },
  computed: {
    animatedNumber () {
      return Math.round(this.tweenedNumber)
    }
  },
  watch: {
    number (newValue) {
      TweenLite.to(this.$data, 1, {tweenedNumber: newValue})
    }
  },
  methods: {
    tint (color, percent) {
      let c = Color(color)
      return c.mix(Color('white'), 0.3).rgb()
    }
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  border-radius: 8px;
  padding: 25px 30px;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.1);
}
.icon-wrapper {
  width: 70px;
  height: 70px;
  position: relative;
}
.pad {
  font-size: 70px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.1));
}
.on-top {
  color: #fff;
  font-size: 40px;
  position: absolute;
  top: 15px;
  left: 15px;
}
.text-wrapper {
  padding-left: 14px;
  color: #fff;
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.text-wrapper .number {
  font-family: 'Univers LT 59 Ultra Condensed';
  font-size: 50px;
  white-space: nowrap;
  margin-top: -8px;
}
.text-wrapper .desc {
  font-size: 14px;
  white-space: nowrap;
}
</style>
