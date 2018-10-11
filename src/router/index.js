import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import MainPage from '@/page/MainPage'
import BookingManagement from '@/page/BookingManagement'
import BookingReport from '@/page/BookingReport'
import OperationProject from '@/page/OperationProject'
import OperationKnowledge from '@/page/OperationKnowledge'
import OperationInsurance from '@/page/OperationInsurance'
import OperationCustomer from '@/page/OperationCustomer'
import OperationHelp from '@/page/OperationHelp'
import OperationCooperation from '@/page/OperationCooperation'
import FinanceSalary from '@/page/FinanceSalary'
import FinanceSettlement from '@/page/FinanceSettlement'
import FinanceSettlementDetail from '@/page/FinanceSettlementDetail'
import SystemUser from '@/page/SystemUser'
import SystemCharacter from '@/page/SystemCharacter'
import SystemDict from '@/page/SystemDict'
import AppIndex from '@/page/AppIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainPage,
      children: [
        {path: '', component: AppIndex},
        {path: '/booking/management', component: BookingManagement},
        {path: '/booking/report', component: BookingReport},
        {path: '/operation/project', component: OperationProject},
        {path: '/operation/knowledge', component: OperationKnowledge},
        {path: '/operation/insurance', component: OperationInsurance},
        {path: '/operation/customer', component: OperationCustomer},
        {path: '/operation/help', component: OperationHelp},
        {path: '/operation/cooperation', component: OperationCooperation},
        {path: '/finance/salary', component: FinanceSalary},
        {path: '/finance/settlement', component: FinanceSettlement},
        {path: '/finance/settlement_detail', component: FinanceSettlementDetail},
        {path: '/system/user', component: SystemUser},
        {path: '/system/character', component: SystemCharacter},
        {path: '/system/dict', component: SystemDict}
      ]
    },
    {path: '/login', component: Login}
  ]
})
