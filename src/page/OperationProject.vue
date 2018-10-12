<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>体检项目</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar fix">
        筛选查询
        <el-button class="r" @click="screenSubmit">查询结果</el-button>
        <el-button type="text" class="r" @click="screenShow = !screenShow">{{screenShow ? '收起' : '展开'}}筛选</el-button>
      </div>
      <el-form :inline="true" :model="screenData" class="demo-form-inline" v-show="screenShow">
        <el-form-item label="项目名称：">
          <el-input v-model="screenData.projectName" placeholder="项目名称"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r" @click="customDialogVisible = true">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称">
        </el-table-column>
        <el-table-column
          prop="projectDescription"
          label="项目介绍">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="selfBkge"
          label="分享者分佣金额">
        </el-table-column>
        <el-table-column
          prop="oneBkge"
          label="分享者上级分佣金额">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 15, 20]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <!-- 详情弹出框 -->
    <el-dialog title="预约详情" width="760px" custom-class="custom-dialog" size="small" :visible.sync="customDialogVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目价格">
          <el-input v-model.number="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="form.projectDescription"></el-input>
        </el-form-item>
        <el-form-item label="项目编码">
          <el-input v-model="form.projectCode"></el-input>
        </el-form-item>
        <el-form-item label="机构代码">
          <el-input v-model="form.orgCode"></el-input>
        </el-form-item>
        <el-form-item label="个人佣金">
          <el-input v-model="form.selfBkge"></el-input>
        </el-form-item>
        <el-form-item label="上级佣金">
          <el-input v-model="form.oneBkge"></el-input>
        </el-form-item>
        <el-form-item label="机构佣金">
          <el-input v-model="form.orgBkge"></el-input>
        </el-form-item>
        <el-form-item label="设备佣金">
          <el-input v-model="form.deviceBkge"></el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.projectImg"></el-input>
        </el-form-item>
        <el-form-item label="项目介绍">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="customDialogVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
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
    return {
      screenData: {
        projectName: ''
      },
      page: {
        pageSize: 15,
        pageNum: 1
      },
      form: {
        projectName: '',
        amount: '',
        projectDescription: '',
        projectCode: '',
        orgCode: '',
        selfBkge: '',
        oneBkge: '',
        orgBkge: '',
        deviceBkge: '',
        projectImg: '',
        content: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入项目价格', trigger: 'blur' },
          { type: 'number', message: '项目价格必须为数字', trigger: 'blur' },
        ],
        projectDescription: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
        ],
        projectCode: [
          { required: true, message: '请输入项目编码', trigger: 'blur' },
          { max: 32, message: '项目编码最长32个字符', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '请输入项目编码', trigger: 'blur' },
          { max: 32, message: '项目编码最长32个字符', trigger: 'blur' }
        ],
        selfBkge: [
          { required: true, message: '请输入个人佣金', trigger: 'blur' },
          { type: 'number', message: '项目价格必须为数字', trigger: 'blur' },
        ],
      },
      totalPage: 0,
      screenShow: true,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      detailData: {}
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getOperationProject, {
        param: this.screenData,
        page: this.page
      })
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    async onSubmit() {

    },
    screenSubmit() {
      this.page.pageNum = 1
      this.getData()
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

<style lang="less">
.custom-dialog .el-dialog__body {
  padding: 46px 130px;
}
</style>
