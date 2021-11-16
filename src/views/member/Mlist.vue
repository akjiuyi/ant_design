<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="8">
              <a-form-item label="平台id">
                <a-input v-model="queryParam.platform_id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <!--<a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>-->
                <a-button type="primary" @click="searchMember">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => {this.queryParam = {},$refs.table.refresh(true)}">重置</a-button>
                <!--
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
                -->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <!--<a-button type="primary"  @click="addCategory">新增</a-button>
        <a-button type="primary"  @click="handleValid">有效</a-button>
        <a-button type="primary"  @click="handleInvalid">无效</a-button>

        <a-dropdown v-action:edit >
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        -->
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="_id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text">
          {{ text._id }}
        </span>
        <span slot="date" slot-scope="text">
          {{ text | dateFilter }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(';') }}</ellipsis>
        </span>

        <span slot="join" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(";") }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="setGroup(record)">更改用户组</a>
            <a-divider type="vertical" />
            <a @click="addCoin(record)">增加金币</a>
            <!--<a-divider type="vertical" />
            <a @click="setVip(record)">更改vip</a>-->
          </template>
        </span>
      </s-table>

      <!--更改用户组-->
      <set-group
        ref="SetGroup"
        :visible="set_group_visible"
        :loading="confirmLoading"
        :model="set_group_mdl"
        @cancel="setGroupCancel"
        @ok="setGroupOk"
      />

      <!--增加金币-->
      <add-coin
        ref="AddCoin"
        :visible="add_coin_visible"
        :loading="confirmLoading"
        :model="add_coin_mdl"
        @cancel="addCoinCancel"
        @ok="addCoinOk"
      />

      <!--更改vip-->
      <set-vip
        ref="SetVip"
        :visible="set_vip_visible"
        :loading="confirmLoading"
        :model="set_vip_mdl"
        @cancel="setVipCancel"
        @ok="setVipOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getMemberList, searchMember, setUserGroup, setPayType, addMemberCoin } from '@/api/manage'

import SetGroup from './modules/SetGroup'
import AddCoin from './modules/AddCoin'
import SetVip from './modules/SetVip'

const columns = [
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '昵称',
    dataIndex: 'nickname'
  },
  {
    title: '平台id',
    dataIndex: 'platform_id'
  },
  {
    title: '是否VIP',
    dataIndex: 'vip',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '否'
      } else if (text === 1) {
        str = '是'
      }
      return str
    }
  },
  {
    title: '邀请人数',
    dataIndex: 'inviters'
  },
  {
    title: '余额',
    dataIndex: 'balance'
  },
  {
    title: '金币',
    dataIndex: 'coins'
  },
  {
    title: '粉丝数',
    dataIndex: 'followers'
  },
  {
    title: '关注数',
    dataIndex: 'following'
  },
  {
    title: '用户组',
    dataIndex: 'group',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '游客'
      } else if (text === 1) {
        str = '原创个人'
      } else if (text === 2) {
        str = '原创大神'
      } else if (text === 3) {
        str = '专业工作室'
      }
      return str
    }
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    customRender: (text) => {
      return moment(text * 1000 + 4 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
      // return moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'HomeClist',
  components: {
    SetGroup,
    AddCoin,
    SetVip,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      user_id: '',
      visible: false,
      set_group_visible: false,
      add_coin_visible: false,
      set_vip_visible: false,
      confirmLoading: false,
      mdl: null,
      set_group_mdl: null,
      add_coin_mdl: null,
      set_vip_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        if (requestParameters.platform_id) {
          return searchMember({ platform_id: requestParameters.platform_id })
            .then(res => {
              if (res.code === 0) {
                return res
              } else {
                return { code: 0, data: [] }
              }
            }).catch((err) => {
              console.log('logout fail:', err)
              // resolve()
            }).finally(() => {
            })
        } else {
          return getMemberList(requestParameters)
            .then(res => {
              if (res.code === 0) {
                return res
              }
            }).catch((err) => {
              console.log('logout fail:', err)
              // resolve()
            }).finally(() => {
            })
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    joinFilter (text) {
      let str = ''
      for (var i = 0; i < text.length; i++) {
        str += text[i] + ';'
      }

      return str
    },
    dateFilter (text) {
      return this.getDate(text)
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    sectionRowSelection () {
      return {
        selectedSectionRowKeys: this.selectedSectionRowKeys,
        onChange: this.onSectionSelectChange
      }
    }
  },
  methods: {
    // 设置用户组
    setGroup (record) {
      this.user_id = record._id
      this.set_group_mdl = { ...record }
      this.set_group_visible = true
    },
    // 增加金币
    addCoin (record) {
      // 获取视频信息
      this.user_id = record._id
      this.add_coin_visible = true
    },
    setVip (record) {
      this.user_id = record._id
      this.set_vip_mdl = { ...record }
      this.set_vip_visible = true
    },
    // 更改用户组
    setGroupOk () {
      const form = this.$refs.SetGroup.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.user_id = this.user_id
          console.log('====')
          console.log('values', values)

          setUserGroup(values).then(res => {
            this.set_group_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('设置用户组成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    // 增加金币
    addCoinOk () {
      const form = this.$refs.AddCoin.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.user_id = this.user_id
          addMemberCoin(values).then(res => {
            this.add_coin_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('增加金币成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    setVipOk () {
      const form = this.$refs.SetPayType.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          console.log('values', values)

          setPayType(values).then(res => {
            this.set_pay_type_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('更改支付成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    setGroupCancel () {
      this.confirmLoading = false
      this.set_group_visible = false
    },
    addCoinCancel () {
      this.confirmLoading = false
      this.add_coin_visible = false
    },
    setVipCancel () {
      this.confirmLoading = false
      this.set_vip_visible = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onSectionSelectChange (selectedRowKeys, selectedRows) {
      this.selectedSectionRowKeys = selectedRowKeys
      this.selectedSectionRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    searchMember () {
      if (!this.queryParam.platform_id) {
        this.$message.error('请输入平台id')
        return false
      }
      this.$refs.table.refresh()
    }
  }
}
</script>
