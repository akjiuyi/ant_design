<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="40">
            <template>
              <a-col :md="4" :sm="8">
                <a-form-item label="日期">
                  <a-date-picker v-model="start_date" placeholder="请输入日期"/>
                </a-form-item>
              </a-col>

              <a-col :md="4" :sm="8">
                <a-form-item label="统计方式">
                  <a-select
                    default-value="1"
                    style="width: 120px"
                    @change="handleChange"
                  >
                    <a-select-option value="1">
                      留存数
                    </a-select-option>
                    <a-select-option value="2">
                      留存率
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 4" :sm="4">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="getRemain()">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
                <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>-->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <span>日期倒数3天留存数据如下</span>
      <a-table :columns="columns" :data-source="data" bordered :pagination="false" :loading="loading_show"></a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { getRemainStatistics } from '@/api/manage'

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '当天',
    dataIndex: 'r0day_remain',
    key: 'r0day_remain'
  },
  {
    title: '+1',
    dataIndex: 'r1day_remain',
    key: 'r1day_remain'
  },
  {
    title: '+2',
    dataIndex: 'r2day_remain',
    key: 'r2day_remain'
  },
  {
    title: '+3',
    dataIndex: 'r3day_remain',
    key: 'r3day_remain'
  },
  {
    title: '+4',
    dataIndex: 'r4day_remain',
    key: 'r4day_remain'
  },
  {
    title: '+5',
    dataIndex: 'r5day_remain',
    key: 'r5day_remain'
  },
  {
    title: '+6',
    dataIndex: 'r6day_remain',
    key: 'r6day_remain'
  },
  {
    title: '+7',
    dataIndex: 'r7day_remain',
    key: 'r7day_remain'
  }
  /*
  {
    title: '+8',
    dataIndex: 'r8day_remain',
    key: 'r8day_remain'
  },
  {
    title: '+9',
    dataIndex: 'r9day_remain',
    key: 'r9day_remain'
  },
  {
    title: '+10',
    dataIndex: 'r10day_remain',
    key: 'r10day_remain'
  },
  {
    title: '+11',
    dataIndex: 'r11day_remain',
    key: 'r11day_remain'
  },
  {
    title: '+12',
    dataIndex: 'r12day_remain',
    key: 'r12day_remain'
  },
  {
    title: '+13',
    dataIndex: 'r13day_remain',
    key: 'r13day_remain'
  },
  {
    title: '+14',
    dataIndex: 'r14day_remain',
    key: 'r14day_remain'
  },
  {
    title: '+15',
    dataIndex: 'r15day_remain',
    key: 'r15day_remain'
  },
  {
    title: '+16',
    dataIndex: 'r16day_remain',
    key: 'r16day_remain'
  },
  {
    title: '+17',
    dataIndex: 'r17day_remain',
    key: 'r17day_remain'
  },
  {
    title: '+18',
    dataIndex: 'r18day_remain',
    key: 'r18day_remain'
  },
  {
    title: '+19',
    dataIndex: 'r19day_remain',
    key: 'r19day_remain'
  },
  {
    title: '+20',
    dataIndex: 'r20day_remain',
    key: 'r20day_remain'
  },
  {
    title: '+25',
    dataIndex: 'r25day_remain',
    key: 'r25day_remain'
  },
  {
    title: '+30',
    dataIndex: 'r30day_remain',
    key: 'r30day_remain'
  }
   */
]

const data = []

export default {
  name: 'TotalTable',
  components: {
  },
  data () {
    return {
      data,
      columns,
      // 高级搜索 展开/关闭
      advanced: false,
      start_date: moment(new Date().getTime()),
      type: 1,
      loading_show: false
    }
  },
  mounted () {
    const currentData = moment(new Date().getTime()).format('YYYY-MM-DD')
    // const currentData1 = moment(new Date().getTime() + 4 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')  //上海时区
    // console.log('56564', currentData1)
    const param = { start_date: currentData, type: this.type }
    this.Remain(param)
  },
  methods: {
    resetSearch () {
      this.start_date = moment(new Date().getTime())
      const param = { start_date: this.start_date.format('YYYY-MM-DD'), type: this.type }
      this.Remain(param)
    },
    getRemain () {
      if (!this.start_date) {
        this.$message.error('请选择日期')
        return false
      }
      const param = { start_date: this.start_date.format('YYYY-MM-DD'), type: this.type }
      this.Remain(param)
    },
    Remain (param) {
      this.loading_show = true
      let temp = {}
      getRemainStatistics(param).then(res => {
        this.data = []
        if (res.code === 0) {
          res.data.lists.forEach((item, index) => {
            temp = { key: index, date: item.first_day_date }
            item.remain_date.forEach((item, index) => {
              if (index === 0) {
                temp.r0day_remain = item.day_remain_count
              }
              if (index === 1) {
                temp.r1day_remain = item.day_remain_count
              }
              if (index === 2) {
                temp.r2day_remain = item.day_remain_count
              }
              if (index === 3) {
                temp.r3day_remain = item.day_remain_count
              }
              if (index === 4) {
                temp.r4day_remain = item.day_remain_count
              }
              if (index === 5) {
                temp.r5day_remain = item.day_remain_count
              }
              if (index === 6) {
                temp.r6day_remain = item.day_remain_count
              }
              if (index === 7) {
                temp.r7day_remain = item.day_remain_count
              }
              if (index === 8) {
                temp.r8day_remain = item.day_remain_count
              }
              if (index === 9) {
                temp.r9day_remain = item.day_remain_count
              }
              if (index === 10) {
                temp.r10day_remain = item.day_remain_count
              }
              if (index === 11) {
                temp.r11day_remain = item.day_remain_count
              }
              if (index === 12) {
                temp.r12day_remain = item.day_remain_count
              }
              if (index === 13) {
                temp.r13day_remain = item.day_remain_count
              }
              if (index === 14) {
                temp.r14day_remain = item.day_remain_count
              }
              if (index === 15) {
                temp.r15day_remain = item.day_remain_count
              }
              if (index === 16) {
                temp.r16day_remain = item.day_remain_count
              }
              if (index === 17) {
                temp.r17day_remain = item.day_remain_count
              }
              if (index === 18) {
                temp.r18day_remain = item.day_remain_count
              }
              if (index === 19) {
                temp.r19day_remain = item.day_remain_count
              }
              if (index === 20) {
                temp.r20day_remain = item.day_remain_count
              }
              if (index === 25) {
                temp.r25day_remain = item.day_remain_count
              }
              if (index === 30) {
                temp.r30day_remain = item.day_remain_count
              }
            })
            this.data.push(temp)
          })
        }
        this.loading_show = false
      })
    },
    handleChange (value) {
      this.type = value
    }
  }
}
</script>
