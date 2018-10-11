<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约</el-breadcrumb-item>
      <el-breadcrumb-item>体检报告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar fix">
        筛选查询
        <el-button class="r" @click="screenSubmit">查询结果</el-button>
        <el-button type="text" class="r" @click="screenControl">{{screenShow ? '收起' : '展开'}}筛选</el-button>
      </div>
      <el-form :inline="true" :model="screenData" class="demo-form-inline" v-show="screenShow" ref="screenForm" :rules="rules">
        <el-form-item label="姓名：" prop="userName">
          <el-input type="text" v-model="screenData.userName" placeholder="姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input type="tel" v-model="screenData.phone" placeholder="手机号" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r">导出信息</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column fixed type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80" :formatter="sexHandle">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="appointmentDate" label="预约时间" width="165">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="150">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="150" :formatter="statusHandle">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="165">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="uploadReport(scope.row)" type="text" size="small">上传报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 15, 20]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 详情弹出框 -->
    <el-dialog title="预约详情" width="760px" custom-class="custom-dialog" :visible.sync="customDialogVisible">
      <div class="detail-item">
        <p class="item-title">预约信息</p>
        <div class="item-info fix">
          <p class="info-title l">预约时间：</p>
          <p class="info-content l" v-html="detailData.appointmentDate"></p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">预约地点：</p>
          <p class="info-content l" v-html="detailData.orgName">111</p>
        </div>
      </div>
      <div class="detail-item">
        <p class="item-title">费用及备注</p>
        <div class="item-info fix">
          <p class="info-title l">体检费用：</p>
          <p class="info-content l">￥{{detailData.checkAmount}}</p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">备注：</p>
          <p class="info-content l" v-html="detailData.remark"></p>
        </div>
      </div>
      <div class="detail-item">
        <p class="item-title">体检人信息</p>
        <div class="item-info fix">
          <p class="info-title l">姓名：</p>
          <p class="info-content l" v-html="detailData.name"></p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">性别：</p>
          <p class="info-content l">{{detailData.sex ? '男' : '女'}}</p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">手机号：</p>
          <p class="info-content l" v-html="detailData.phone"></p>
        </div>
      </div>
      <div class="detail-item">
        <p class="item-title">上传报告</p>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :limit="1"
          accept="pdf"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10M</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../utils/http.js'
import api from '../utils/api.js'

export default {
  created() {
    this.getData()
  },
  data() {
    let checkPhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      } else {
        callback()
      }
    };
    return {
      screenData: {
        userName: '',
        phone: '',
      },
      page: {
        pageSize: 15,
        pageNum: 1
      },
      totalPage: 0,
      screenShow: true,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      detailData: {},
      rules: {
        phone: [
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      fileList: []
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post({
        param: this.screenData,
        page: this.page
      },api.getMedicalReport)
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforeUpload(file) {
      console.log('beforeUpload')
    },
    screenSubmit(){
      this.$refs['screenForm'].validate((valid) => {
        if (valid) {
          this.page.pageNum = 1
          this.getData()
        } else {
          return false
        }
      })
    },
    sexHandle(val) {
      return val.sex ? '男' : '女'
    },
    statusHandle(val) {
      return this.$dict.reportStatus[val.state]
    },
    screenControl() {
      this.screenShow = !this.screenShow
    },
    uploadReport(row) {
      this.$ctloading(async () => {
        let res = await http.get(`${api.getMedicalReportDetail}/${row.healthCheckOrderId}`)
        this.detailData = res.data
        this.customDialogVisible = true
      })
    },
    handleSizeChange(arg) {
      this.page.pageSize = arg
      this.getData()
    },
    handleCurrentChange(arg) {
      this.page.pageNum = arg
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
