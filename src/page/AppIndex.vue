<template>
  <div class="booking-management">
    <div class="wrap-icons">
      <IconNumber color="#09befe" icon="index-top-1"></IconNumber>
      <!-- <IconNumber></IconNumber>
      <IconNumber></IconNumber>
      <IconNumber></IconNumber> -->
    </div>
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
  created() {

  },
  data() {
    return {

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
