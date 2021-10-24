<template>
  <page-header-wrapper>
    <a-card :bordered="false">
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

      <div class="table-operator">
        <a-button type="primary"  @click="addCategory">新增</a-button>
        <!--<a-button type="primary"  @click="handleValid">有效</a-button>
        <a-button type="primary"  @click="handleInvalid">无效</a-button>-->

        <a-dropdown v-action:edit >
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
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
            <a @click="sectionList(record)">查看分区</a>
            <a-divider type="vertical" />
            <a @click="addSection(record)">添加分区</a>
            <!--<a-divider type="vertical" />
            <a @click="editCategory(record)">编辑</a>-->
            <a-divider type="vertical" />
            <a  v-if="record.status" @click="setCategoryState(record._id,0)">下架</a>
            <a  v-else @click="setCategoryState(record._id,1)">上架</a>
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

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>

      <!--查看-->
      <a-modal v-model="section_visible"   ref="detail" title="分区列表" width="60%" @ok="showDiage">
        <s-table
          ref="table1"
          size="default"

          rowKey="key"
          :columns="sectionColumns"
          :data="loadZoneData"
          :alert="true"
          :rowSelection="sectionRowSelection"
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
              <a  v-if="record.status" @click="setSectionState(record._id,0)">下架</a>
              <a  v-else @click="setSectionState(record._id,1)">上架</a>
            </template>
          </span>
        </s-table>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getCategoryList, getSectionOfCategory, addCategory, addSection, setCategoryState, setSectionState } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import AddCategory from './modules/AddCategory'
import AddSection from './modules/AddSection'
import EditCategory from './modules/EditCategory'

const columns = [
  /*
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
*/
  {
    title: '名称',
    dataIndex: 'title'
    // scopedSlots: { customRender: 'link_type' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text) => text
  },
  {
    title: '位置',
    dataIndex: 'position',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '首页分类'
      } else if (text === 1) {
        str = '会员页分类'
      }
      return str
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

// 分区列
const sectionColumns = [
  /*
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
   */
  {
    title: '名称',
    dataIndex: 'title'
    // scopedSlots: { customRender: 'link_type' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text) => text
  },
  {
    title: '作者',
    dataIndex: 'author',
    customRender: (text) => {
      if (!text) {
        return '    '
      } else {
        return text.nickname
      }
    }
  },
  {
    title: '所属分类',
    dataIndex: '_category',
    customRender: (text) => text
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
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    this.sectionColumns = sectionColumns
    return {
      // create model
      category_id: '',
      category_title: '',
      visible: false,
      section_visible: false,
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
      position: { 'position': 0 }, // 首页分类
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, this.position, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getCategoryList(requestParameters)
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
      // 加载数据方法 必须为 Promise 对象
      loadZoneData: parameter => {
        const requestParameters = Object.assign({}, { 'category': this.category_id }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return getSectionOfCategory(requestParameters)
          .then(res => {
            if (res.code === 0) {
              res.data.forEach(element => {
                element._category = this.category_title
              })

              return res
            }
          }).catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          }).finally(() => {
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      selectedSectionRowKeys: [],
      selectedSectionRows: []
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
     getRoleList({ t: new Date() })
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
    // 查看分区
    sectionList (record) {
      this.category_id = record._id
      this.category_title = record.title
      this.section_visible = true
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
      const table = this.$refs.table1
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
    }
  }
}
</script>
