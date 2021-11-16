<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">

            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      -->

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
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <!--<a @click="videoList(record)">查看视频</a>
            <a-divider type="vertical" />
            <a @click="addSection(record)">添加分区</a>
            <a-divider type="vertical" />
            <a @click="editCategory(record)">编辑</a>
            <a-divider type="vertical" />-->
            <a  v-if="record.status" @click="setSectionState(record._id,0)">下架</a>
            <a  v-else @click="setSectionState(record._id,1)">上架</a>
          </template>
        </span>
      </s-table>

      <!--添加分类-->
      <add-category
        ref="AddCategory"
        :visible="add_category_visible"
        :loading="confirmLoading"
        :model="add_category_mdl"
        @cancel="Cancel"
        @ok="addCategoryOk"
      />

      <!--编辑分类-->
      <edit-category
        ref="EditCategory"
        :visible="edit_category_visible"
        :loading="confirmLoading"
        :model="edit_category_mdl"
        @cancel="editCategoryCancel"
        @ok="editCategoryOk"
      />

      <!--添加专区-->
      <add-section
        ref="AddSection"
        :visible="add_section_visible"
        :loading="confirmLoading"
        :model="add_section_mdl"
        @cancel="add_section_visible=false"
        @ok="addSectionOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getSectionList, addCategory, addSection, setCategoryState, setSectionState } from '@/api/manage'

import AddCategory from './modules/AddCategory'
import AddSection from './modules/AddSection'
import EditCategory from './modules/EditCategory'

const columns = [

  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },

  {
    title: '名称',
    dataIndex: 'title'
    // scopedSlots: { customRender: 'link_type' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '绑定作者-仅展示短视频'
      } else if (text === 1) {
        str = '绑定作者仅-展示长视频-footer'
      } else if (text === 2) {
        str = '绑定作者仅-展示长视频五宫格-footer'
      } else if (text === 3) {
        str = '绑定作者仅-展示长视频-横向滚动'
      } else if (text === 4) {
        str = '绑定视频分类-仅展示短视频'
      } else if (text === 5) {
        str = '绑定视频分类-仅展示长视频-footer'
      } else if (text === 6) {
        str = '绑定视频分类-仅展示长视频五宫格-footer'
      } else if (text === 7) {
        str = '绑定视频分类-仅展示长视频-横向滚动'
      }
      return str
    }
  },
  // 0-绑定作者 仅展示短视频
  // 1-绑定作者 仅展示长视频 footer
  // 2-绑定作者 仅展示长视频五宫格  footer
  // 3-绑定作者 仅展示长视频 横向滚动
  // 4-绑定视频分类 仅展示短视频
  // 5-绑定视频分类 仅展示长视频 footer
  // 6-绑定视频分类 仅展示长视频五宫格  footer
  // 7-绑定视频分类 仅展示长视频 横向滚动
  {
    title: '分类',
    dataIndex: '_category',
    customRender: (text) => {
      if (text) {
        return text.title
      } else {
        return '   '
      }
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '下架'
      } else if (text === 1) {
        str = '上架'
      }
      return str
    }
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    customRender: (text) => text
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
    AddCategory,
    AddSection,
    EditCategory,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns

    return {
      // create model
      section_id: '',
      category_title: '',
      visible: false,
      video_visible: false,
      add_category_visible: false,
      edit_category_visible: false,
      add_section_visible: false,
      confirmLoading: false,
      mdl: null,
      add_category_mdl: null,
      edit_category_mdl: null,
      add_section_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getSectionList(requestParameters)
          .then(res => {
            if (res.code === 0) {
              return res
            }
          }).catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          }).finally(() => {
          })
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
    }
  },
  methods: {
    // 查看分区
    videoList (record) {
      this.section_id = record._id
      // this.category_title = record.title
      this.video_visible = true
      this.$refs.table1.refresh()
    },
    // 新增分类
    addCategory () {
      this.mdl = null
      this.add_category_visible = true
    },
    editCategory (record) {
      this.category_id = record._id
      this.edit_category_mdl = { ...record }
      this.edit_category_visible = true
    },
    setCategoryState (id, state) {
      // 设置上架下架
      let str
      if (state === 1) {
        str = '上架'
      } else if (state === 0) {
        str = '下架'
      }

      const param = { category: id, status: state }
      const table = this.$refs.table
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要将该分类' + str + '吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          setCategoryState(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('分类' + str + '成功')
            } else {
              message.info('分类' + str + '失败')
            }
          })
        }
      })
    },
    // 添加提交
    addCategoryOk () {
      const form = this.$refs.AddCategory.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          values.position = 0
          addCategory(values).then(res => {
            console.log(res)

            this.add_category_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加分类成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    editCategoryOk () {
      const form = this.$refs.EditCategory.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values._id = this.category_id
          console.log('values', values)
          /*
          addCategory(values).then(res => {
            console.log(res)

            this.add_category_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加分类成功')
          })
           */
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    editCategoryCancel () {
      this.confirmLoading = false
      this.edit_category_visible = false
    },
    Cancel () {
      this.add_category_visible = false
    },
    addSection (record) {
      this.mdl = null
      this.category_id = record._id
      this.add_section_visible = true
    },
    // 添加提交
    addSectionOk () {
      const form = this.$refs.AddSection.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)

          values.category = this.category_id
          addSection(values).then(res => {
            console.log(res)

            this.add_section_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            // this.$refs.table.refresh()

            this.$message.info('添加分区成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    setSectionState (id, state) {
      // 设置上架下架
      let str
      if (state === 1) {
        str = '上架'
      } else if (state === 0) {
        str = '下架'
      }

      const param = { section_id: id, status: state }
      const table = this.$refs.table
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要将该分区' + str + '吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          setSectionState(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('分区' + str + '成功')
            } else {
              message.info('分区' + str + '失败')
            }
          })
        }
      })
    },
    //
    //
    handleAdd () {
      this.mdl = null
      this.add_visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleValid (record) {

    },
    handleInvalid (record) {

    },
    // 删除
    handleDel (record) {
      // this.visible = true
      this.mdl = { ...record }
      this.$confirm({
        title: '提示',
        content: '确定要删除这条广告吗？',
        onOk () {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {}
      })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 添加提交
    showDiage () {
      this.detail_visible = false
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
