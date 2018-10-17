<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content fix">
      <div class="user-info l">
        <div class="rect-100 pr">
          <div class="info-content pa">
            <icon-svg class="head-img" icon-class="head"></icon-svg>
            <p class="user-name tc el">{{form.loginName}}</p>
            <p class="login-info tc el">上次登录：{{logintime}}</p>
          </div>
        </div>
      </div>
      <div class="table-box r">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="修改密码" name="first">
            <div class="form-box">
              <el-form ref="form" :model="form" label-width="94px" :rules="rules" size="small">
                <el-form-item label="用户名：" prop="loginName" >
                  <el-input v-model="form.loginName" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="realName">
                  <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="旧密码：" prop="oldPwd">
                  <el-input type="password" v-model="form.oldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPwd">
                  <el-input type="password" v-model="form.newPwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="repeatPwd">
                  <el-input type="password" v-model="form.repeatPwd"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="second">
            <el-table
              :data="tableData"
              v-loading="loading"
              style="width: 100%"
            >
              <el-table-column
                prop="createTime"
                label="时间">
              </el-table-column>
              <el-table-column
                prop="operateIpAddr"
                label="IP">
              </el-table-column>
              <el-table-column
                prop="operateRegionCode"
                label="地区">
              </el-table-column>
              <el-table-column
                prop="logName"
                label="操作">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../utils/http'
import api from '../utils/api'
import session from '../utils/session'

export default {
  created() {
    this.getUserInfo()
  },
  data() {
    let validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位及以上长度密码'));
      } else {
        callback();
      }
    };
    let validateNewPwd = (rule, value, callback) => {
      if (value == this.form.oldPwd) {
        callback(new Error('新密码与旧密码一致无需修改'));
      } else {
        callback();
      }
    };
    let validateRepeatPwd = (rule, value, callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      screenData: {
        logName: '',
        ip: '',
        addr: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      form: {
        realName: '',
        newPwd: '',
        loginName: session('username'),
        oldPwd: '',
        repeatPwd: ''
      },
      rules: {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { validator: validatePwd, message: '请输入6位及以上长度密码', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePwd, message: '请输入6位及以上长度密码', trigger: 'blur' },
          { validator: validateNewPwd, message: '新密码与旧密码一致无需修改', trigger: 'blur' }
        ],
        repeatPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePwd, message: '请输入6位及以上长度密码', trigger: 'blur' },
          { validator: validateRepeatPwd, message: '确认密码与新密码不一致', trigger: 'blur' }
        ],
      },
      logintime: session('logintime'),
      totalPage: 0,
      tableData: [],
      loading: false
    }
  },
  methods: {
    async getUserInfo(){
      this.$ctloading(async () => {
        let res = await http.get(api.getUserInfo,{
          loginName: session('username')
        })
        if(res.code === 0){
          this.form.realName = res.data.realName
        } else {
          this.$message.warning('用户信息加载失败，请重试')
        }
      })
    },
    async getLog() {
      this.loading = true
      let res = await http.post(api.getLogPage, {
        param: this.screenData,
        page: this.page
      })
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    async onSubmit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.$ctloading(async () => {
            let res = await http.post(api.updateUserInfo, this.form)
            if(res.code === 0){
              this.$message.success('密码修改成功');
              session('token','')
              this.$router.replace({path: '/login'})
            } else {
              this.$message.warning(res.msg);
            }
          });
        } else {
          return false;
        }
      })
    },
    handleTabClick(tab) {
      if(tab.name === 'second' && !this.tableData.length) this.getLog()
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
.content {
  margin-top: 18px;
  .user-info {
    box-sizing: border-box;
    width: 27.3%;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    .rect-100 {
      padding-bottom: 100%;
    }
    .info-content {
      top: 18%;
      left: 0;
      right: 0;
    }
    .head-img {
      width: 100px;
      height: 100px;
      display: block;
      margin: 0 auto;
    }
    .user-name {
      margin-top: 34px;
      font-size: 16px;
      color: #2e2e2e;
      line-height: 24px;
    }
    .login-info {
      margin-top: 15px;
      font-size: 14px;
      color: #7a7a7a;
      line-height: 24px;
    }
  }
  .table-box {
    box-sizing: border-box;
    width: 70.5%;
    margin: 0;
  }
  .form-box {
    width: 300px;
    margin-top: 10px;
  }
}
</style>
<style lang="less">
.el-main {
  min-width: 1000px;
}
.el-tabs__item:hover,
.el-tabs__item.is-active {
  color: #00a499;
}
.el-tabs__active-bar {
  background-color: #00a499;
}
</style>
