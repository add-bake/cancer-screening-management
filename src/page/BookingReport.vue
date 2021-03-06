<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约</el-breadcrumb-item>
      <el-breadcrumb-item>体检报告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar">筛选查询</div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" ref="screenForm" @keydown.native.enter="screenSubmit">
        <el-form-item label="姓名：" prop="userName">
          <el-input type="text" v-model="screenData.userName" placeholder="姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="screenSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r" @click="exportData">导出信息</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="50"
          :formatter="sexHandle">
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="预约时间"
          width="110"
          :formatter="appointmentDateHandle">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          :formatter="statusHandle">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="110">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="uploadReport(scope.row)" type="text" size="small">{{scope.row.state == '1' ? '上传报告' : '查看详情'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 15, 20]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 详情弹出框 -->
    <el-dialog
      title="体检报告"
      width="760px"
      :custom-class="customClass"
      :visible.sync="customDialogVisible">
      <div class="detail-item">
        <p class="item-title">预约信息</p>
        <div class="item-info fix">
          <p class="info-title l">预约时间：</p>
          <p class="info-content l" v-html="appointmentDateHandle(detailData)"></p>
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
      </div>
      <div class="detail-item" v-show="detailData.state !== 0">
        <p class="item-title">{{detailData.state == '1' ? '上传报告' : '体检报告'}}</p>
        <el-upload
          class="upload-demo"
          :action="uploadSingle"
          :headers="uploadHeader"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :limit="2"
          accept=".pdf,.PDF"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :on-change="handleChange"
          :on-preview="handlePreview"
          :file-list="fileList">
          <el-button size="small" type="primary" v-show="detailData.state !== 0">{{detailData.state == 1 ? '点击上传' : '重新上传'}}</el-button>
          <div slot="tip" class="el-upload__tip" v-show="detailData.state !== 0">只能上传pdf文件，且不超过10M</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer" v-show="detailData.state !== 0">
        <el-button size="small" @click="customDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="uploadSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../utils/http.js"
import api from "../utils/api.js"
import session from '../utils/session'
import dayjs from 'dayjs'

export default {
  created() {
    this.uploadSingle = `${process.env.API_ROOT}${api.uploadSingle}`
    this.getData();
  },
  data() {
    return {
      screenData: {
        userName: ""
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      uploadHeader: {'Authorization': session('token')},
      totalPage: 0,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      detailData: {},
      fileList: [],
      healthCheckOrderId: "",
      uploadState: "",
      customClass: 'custom-dialog'
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      let res = await http.post(api.getMedicalReport,
        {
          param: this.screenData,
          page: this.page
        }
      );
      this.loading = false;
      this.tableData = res.data;
      this.totalPage = res.page.total;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleProgress(event) {
      this.uploadState = "loading";
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange(file,fileList) {
      this.fileList = [fileList[fileList.length-1]]
      this.fileList[0].name = `${this.detailData.name}体检报告.pdf`
    },
    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 10) {
        return this.$message.warning("文件大小不能超过10M");
      }
    },
    handleSuccess(response, file, fileList) {
      fileList[0].url = `${process.env.IMG_ROOT}${fileList[0].response.data}`
      this.fileList = fileList;
      this.uploadState = "success";
    },
    handlePreview() {
      if (this.uploadState == "loading") {
        return this.$message.warning("请等待文件上传完成");
      }
      window.open(this.fileList[0].url)
    },
    appointmentDateHandle(val) {
      return dayjs(val.appointmentDate).format('YYYY-MM-DD')+' '+val.appointmentTimeStr
    },
    screenSubmit() {
      this.$refs["screenForm"].validate(valid => {
        if (valid) {
          this.page.pageNum = 1;
          this.getData();
        } else {
          return false;
        }
      });
    },
    sexHandle(val) {
      return val.sex ? "男" : "女";
    },
    statusHandle(val) {
      return this.$dict.reportStatus[val.state];
    },
    uploadSubmit() {
      if (this.uploadState == "loading") {
        return this.$message.warning("请等待文件上传完成");
      }
      if (!this.fileList.length) {
        return this.$message.warning("请先上传体检报告");
      }
      if (this.uploadState == "") {
        return this.$message.warning("请先上传体检报告");
      }
      this.$ctloading(async () => {
        let res = await http.post(api.reportCommit, {
          healthCheckOrderId: this.healthCheckOrderId,
          checkReportFile: this.fileList[0].response.data
        });
        if(res.data){
          this.$message.success("上传成功");
          this.detailData.state = 2
        }
      });
    },
    uploadReport(row) {
      this.healthCheckOrderId = row.healthCheckOrderId;
      this.$ctloading(async () => {
        let res = await http.get(
          `${api.getMedicalReportDetail}/${row.healthCheckOrderId}`
        );
        this.detailData = res.data;
        this.customDialogVisible = true;
        if(res.data.state !== 0){
          this.customClass = 'custom-dialog has-upload'
        } else {
          this.customClass = 'custom-dialog'
        }
        if(res.data.checkReportFile){
          this.fileList[0] = {name: `${res.data.name}体检报告.pdf`, url: `${process.env.IMG_ROOT}${res.data.checkReportFile}`}
        }
      });
    },
    handleSizeChange(arg) {
      this.page.pageSize = arg;
      this.getData();
    },
    handleCurrentChange(arg) {
      this.page.pageNum = arg;
      this.getData();
    },
    exportData() {
      http.download(`${api.exportCheckPresentation}`,this.screenData)
    }
  }
};
</script>

<style lang="less">
.custom-dialog.has-upload {
  .el-dialog__body {
    padding: 46px 130px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
