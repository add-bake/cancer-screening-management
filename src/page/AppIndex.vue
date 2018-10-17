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
        <div ref="book-chart" style="width: 100%; height: 300px;"></div>
      </ChartContainer>

      <ChartContainer style="margin-top: 20px;" title="销售统计">
        <div ref="sell-chart" style="width: 100%; height: 300px;"></div>
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
    let bookChart = echarts.init(this.$refs['book-chart'])
    let sellChart = echarts.init(this.$refs['sell-chart'])

    let option1 = {
      title: {
        text: 'Beijing AQI'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: data.map(function(item) {
          return item[0];
        })
      },
      yAxis: {
        splitLine: {
          show: false
        }
      },
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          startValue: '2014-06-01'
        },
        {
          type: 'inside'
        }
      ],
      visualMap: {
        top: 10,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 50,
            color: '#096'
          },
          {
            gt: 50,
            lte: 100,
            color: '#ffde33'
          },
          {
            gt: 100,
            lte: 150,
            color: '#ff9933'
          },
          {
            gt: 150,
            lte: 200,
            color: '#cc0033'
          },
          {
            gt: 200,
            lte: 300,
            color: '#660099'
          },
          {
            gt: 300,
            color: '#7e0023'
          }
        ],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        name: 'Beijing AQI',
        type: 'line',
        data: data.map(function(item) {
          return item[1];
        }),
        markLine: {
          silent: true,
          data: [
            {
              yAxis: 50
            },
            {
              yAxis: 100
            },
            {
              yAxis: 150
            },
            {
              yAxis: 200
            },
            {
              yAxis: 300
            }
          ]
        }
      }
    }

    let option2 = {
      title: {
        text: '堆叠区域图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: { normal: {} },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }

    bookChart.setOption(option1)
    sellChart.setOption(option2)
  },
  data() {
    return {
      numbers: {
        one: 0,
        two: 0,
        three: 0,
        four: 0
      }
    }
  },
  methods: {}
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
