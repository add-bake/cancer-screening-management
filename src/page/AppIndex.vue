<template>
  <transition appear name="fade">
    <div class="booking-management">
      <div class="wrap-icons">
        <IconNumber color="#09befe" icon="index-top-1" :number="numbers.one" desc="10天内推广数"></IconNumber>
        <IconNumber color="#a18dd0" icon="index-top-2" :number="numbers.two" desc="10天内预约数"></IconNumber>
        <IconNumber color="#e5a43d" icon="index-top-3" :number="numbers.three" desc="未完成体检数"></IconNumber>
        <IconNumber color="#f56c6c" icon="index-top-4" :number="numbers.four" desc="30天内日均体检数"></IconNumber>
      </div>

      <ChartContainer style="margin-top: 20px;" title="每天预约信息">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :start-placeholder="sTime"
          :end-placeholder="eTime"
          :picker-options="pickerOptions"
          slot="titleOperation">
        </el-date-picker>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column
            :prop="index ? item.dictItemCode : 'date'"
            :label="item.dictItemName"
            v-for="(item,index) in dateRangeDict"
            :key="item.dictItemId">
          </el-table-column>
        </el-table>
      </ChartContainer>

      <div class="footer">本平台由烟台海涛网络科技有限公司研制开发&nbsp;&nbsp;&nbsp;&nbsp;网址：www.haitao-tech.com&nbsp;&nbsp;&nbsp;&nbsp;咨询电话：0535-3942067</div>
    </div>
  </transition>
</template>

<script>
import http from '../utils/http.js'
import api from '../utils/api.js'
import IconNumber from '@/component/IconNumber'
import ChartContainer from '@/component/ChartContainer'
import echarts from 'echarts'
import data from '../utils/chart-mock.js'
import dayjs from 'dayjs'

export default {
  components: {
    IconNumber,
    ChartContainer
  },
  mounted() {
    this.numbers = {
      one: 200,
      two: 50,
      three: 20,
      four: 10
    }
    this.getDateRangeDict()
  },
  watch: {
    'dateRange'(val){
      if(val){
        this.sTime = dayjs(val[0]).format('YYYY-MM-DD')
        this.eTime = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.sTime = ''
        this.eTime = ''
      }
      this.getData()
    }
  },
  data() {
    return {
      numbers: {
        one: 0,
        two: 0,
        three: 0,
        four: 0
      },
      dateRangeDict: [{
        seqNum: '',
        dictItemName: '日期'
      }],
      sTime: dayjs().format('YYYY-MM-DD'),
      eTime: dayjs(new Date().getTime() + 3600 * 1000 * 24 * 7).format('YYYY-MM-DD'),
      tableData: [],
      loading: false,
      dateRange: '',
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  methods: {
    async getDateRangeDict () {
      this.$ctloading(async () => {
        let res = await http.get(api.getDateRangeDict, {
          typeCode: 'APPOINTMENT_TIME'
        })
        if(res.code === 0){
          res.data.map(item => {
            this.dateRangeDict.push(item)
          })
          this.getData()
        } else {
          this.$message.warning("每日预约信息，获取时间段数据失败")
        }
      });
      
    },
    async getData () {
      this.loading = true;
      let res = await http.get(api.getHomeOrder,
        {
          sTime: this.sTime,
          eTime: this.eTime
        }
      );
      this.loading = false;
      this.tableData = []
      if(Object.keys(res.data).length){
        Object.keys(res.data).map((item,index) => {
          let tableItem = Object.assign({
            date: item
          },res.data[item])
          this.tableData.push(tableItem)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.booking-management {
  padding-bottom: 40px;
}
.wrap-icons {
  display: grid;
  grid-auto-rows: 120px;
  grid-gap: 16px 20px;
  grid-template-columns: repeat(4, 1fr);
}
.footer {
  text-align: center;
  color: #666;
  background-color: #fff;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 0;
  left: -20px;
  right: -20px;
}
</style>
