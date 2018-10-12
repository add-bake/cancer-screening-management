<template>
  <div class="booking-management">
    <transition appear name="fade">
      <div class="wrap-icons">
        <IconNumber color="#09befe" icon="index-top-1" :number="numbers.one" desc="10天内推广数"></IconNumber>
        <IconNumber color="#a18dd0" icon="index-top-2" :number="numbers.two" desc="10天内预约数"></IconNumber>
        <IconNumber color="#e5a43d" icon="index-top-3" :number="numbers.three" desc="未完成体检数"></IconNumber>
        <IconNumber color="#f56c6c" icon="index-top-4" :number="numbers.four" desc="30天内日均体检数"></IconNumber>
      </div>
    </transition>
  </div>
</template>

<script>
import http from '../utils/http.js'
import api from '../utils/api.js'
import IconNumber from '@/component/IconNumber'

export default {
  components: {
    IconNumber
  },
  mounted () {
    this.numbers = {
      one: 200,
      two: 50,
      three: 20,
      four: 10
    }
  },
  data () {
    return {
      numbers: {
        one: 0,
        two: 0,
        three: 0,
        four: 0
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.wrap-icons {
  display: grid;
  grid-auto-rows: 120px;
  grid-gap: 16px 20px;
  grid-template-columns: repeat(4, 1fr);
}
</style>
