<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <template>
              <a-col :md="8" :sm="24">
                <a-form-item label="日期">
                  <a-date-picker v-model="queryParam.start_date" style="width: 40%" placeholder="请输入开始日期"/>-
                  <a-date-picker v-model="queryParam.end_date" style="width: 40%" placeholder="请输入结束日期"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="getStatistics(false)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>-->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div style="background: #f0f2f5">
        <a-row type="flex" justify="start" style="padding-top: 1rem;padding-bottom: 1rem">
          <a-col :span="4" style="background: white;margin-left: 1rem;box-shadow: 2px 2px 2px rgb(179 179 179);">
            <div style="height: 6rem;display: flex;justify-content: space-around;align-items: center;">
              <div style="text-align: center;width: 3rem;"><a-icon type="team" :style="{ fontSize: '40px', color: '#08c'}"/><span>会员</span></div>
              <div style="margin-right: 2rem;">注册用户：{{ regitsterCount }}</div>
            </div>
          </a-col>
          <a-col :span="4" style="background: white;margin-left: 1rem;box-shadow: 2px 2px 2px rgb(179 179 179);">
            <div style="height: 6rem;display: flex;justify-content: space-around;align-items: center;">
              <div style="text-align: center;width: 3rem;"><a-icon type="user" :style="{ fontSize: '40px', color: '#08c'}"/><span>登陆</span></div>
              <div style="margin-right: 2rem;">活跃用户：{{ activeCount }}</div>
            </div>
          </a-col>
          <a-col :span="4" style="background: white;margin-left: 1rem;box-shadow: 2px 2px 2px rgb(179 179 179);">
            <div style="height: 6rem;display: flex;justify-content: space-around;align-items: center;">
              <div style="text-align: center;width: 4rem;"><a-icon type="dollar" :style="{ fontSize: '40px', color: '#08c',width:'100%'}"/><span>会员充值</span></div>
              <div style="margin-right: 2rem;">会员充值金额：{{ vipRecharge }}</div>
            </div>
          </a-col>
          <a-col :span="4" style="background: white;margin-left: 1rem;box-shadow: 2px 2px 2px rgb(179 179 179);">
            <div style="height: 6rem;display: flex;justify-content: space-around;align-items: center;">
              <div style="text-align: center;width: 4rem;"><a-icon type="money-collect" :style="{ fontSize: '40px', color: '#08c',width:'100%'}"/><span>钻石充值</span></div>
              <div style="margin-right: 2rem;">钻石充值金额：{{ coinRecharge }}</div>
            </div>
          </a-col>
        </a-row>
      </div>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getRegisterCount, getActiveCount, getVipRecharge, getCoinRecharge } from '@/api/manage'

export default {
  name: 'TotalTable',
  components: {
  },
  data () {
    return {
      // create model
      // 高级搜索 展开/关闭
      regitsterCount: 0,
      activeCount: 0,
      vipRecharge: 0,
      coinRecharge: 0,
      advanced: false,
      // 查询参数
      queryParam: {}
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  mounted () {
    // 初始统计
    this.getStatistics(true)
  },
  methods: {
    // 获取统计
    getStatistics (isInit) {
      // const startTimeObj = new Date('2010-1-1 00:00:00')
      const endTimeObj = new Date(+new Date(new Date().toLocaleDateString()) + 24 * 60 * 60 * 1000 - 1)
      const startTime = new Date('2010-1-1 00:00:00').getTime().toString()
      const endTime = Date.parse(endTimeObj).toString()

      let param = { start: startTime.substr(0, 10), end: endTime.substr(0, 10) }
      if (!isInit) {
        const requestParameters = Object.assign({}, this.queryParam)
        if (!requestParameters.start_date) {
          this.$message.error('请输入开始日期')
          return false
        }

        if (!requestParameters.end_date) {
          this.$message.error('请输入结束日期')
          return false
        }
        // console.log('loadData request parameters:', requestParameters.start_date.format('YYYY-MM-DD'))
        const startTimeStr = requestParameters.start_date.format('YYYY-MM-DD') + ' 00:00:00'
        const endTimeStr = requestParameters.end_date.format('YYYY-MM-DD') + ' 23:59:59'
        const startTimeObj = new Date(startTimeStr)
        const endTimeObj = new Date(endTimeStr)
        const startTime = Date.parse(startTimeObj).toString()
        const endTime = Date.parse(endTimeObj).toString()

        param = { start: startTime.substr(0, 10), end: endTime.substr(0, 10) }
      }

      getRegisterCount(param)
        .then(res => {
          if (res.code === 0) {
            this.regitsterCount = res.data.usersCnt
          } else {
            console.log('请求失败')
          }
        }).catch((err) => {
        console.log('logout fail:', err)
        // resolve()
      }).finally(() => {
      })

      getActiveCount(param)
        .then(res => {
          if (res.code === 0) {
            // return res
            this.activeCount = res.data.activeUsers
          } else {
            console.log('请求失败')
          }
        }).catch((err) => {
        console.log('logout fail:', err)
        // resolve()
      }).finally(() => {
      })

      getVipRecharge(param)
        .then(res => {
          if (res.code === 0) {
            this.vipRecharge = res.data.totalAmount
          } else {
            console.log('请求失败')
          }
        }).catch((err) => {
        console.log('logout fail:', err)
        // resolve()
      }).finally(() => {
      })

      getCoinRecharge(param)
        .then(res => {
          if (res.code === 0) {
            this.coinRecharge = res.data.totalAmount
          } else {
            console.log('请求失败')
          }
        }).catch((err) => {
        console.log('logout fail:', err)
        // resolve()
      }).finally(() => {
      })
    }
  }
}
</script>
