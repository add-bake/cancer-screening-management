export default {
  login: '/auth/login',
  getCodeImg: '/auth/imgPath',
  getBookingOrder: '/api/check/order/page', //分页查询预约信息
  getBookingOrderDetail: '/api/check/order', //查看体检预约详情
  getMedicalReport: '/api/check/presentation/page', //分页查询体检报告
  getMedicalReportDetail: '/api/check/presentation', //查看体检报告详情
  uploadSingle: '/api/upload/single', //单文件上传
  reportCommit: '/api/check/presentation/commit', //体检报告提交
  getOperationProject: '/api/project/page', //分页查询体检项目列表
  /* 合作机构 */
  getOrgPage: '/api/org/page'
}
