<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <!--<a-button type="primary"  @click="addCategory">新增</a-button>
        <a-button type="primary"  @click="handleValid">有效</a-button>
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
          <ellipsis :length="12" tooltip>{{ text.join(';') }}</ellipsis>
        </span>

        <span slot="join" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(";") }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="bindToSection(record)">添加到分区</a>
            <a-divider type="vertical" />
            <a @click="editVideo(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="setPayType(record)">更改付费类型</a>
            <a-divider type="vertical" />
            <a @click="bindAuthor(record)">绑定作者</a>
            <!--<a-divider type="vertical" />
            <a @click="bindModels(record)">绑定演员</a>-->
            <a-divider type="vertical" />
            <a @click="AddToForm(record)">添加到表单</a>
            <a-divider type="vertical" />
            <!--<a @click="deleteVideo(record)">删除</a>
            <a-divider type="vertical" />-->
            <a v-if="record.status" @click="setVideoState(record._id,0)">下架</a>
            <a v-else @click="setVideoState(record._id,1)">上架</a>
          </template>
        </span>
      </s-table>

      <!--添加到分区-->
      <bind-video
        ref="BindVideo"
        :visible="bind_video_visible"
        :loading="confirmLoading"
        :model="bind_video_mdl"
        @cancel="BindVideoCancel"
        @ok="BindVideoOk"
      />

      <!--编辑视频-->
      <edit-video
        ref="EditVideo"
        :visible="edit_video_visible"
        :loading="confirmLoading"
        :model="edit_video_mdl"
        @cancel="EditVideoCancel"
        @ok="EditVideoOk"
      />

      <!--更改付费类型-->
      <set-pay-type
        ref="SetPayType"
        :visible="set_pay_type_visible"
        :loading="confirmLoading"
        :model="set_pay_type_mdl"
        @cancel="SetPayTypeCancel"
        @ok="SetPayTypeOk"
      />

      <!--绑定作者-->
      <bind-author
        ref="BindAuthor"
        :visible="bind_author_visible"
        :loading="confirmLoading"
        :model="bind_author_mdl"
        @cancel="BindAuthorCancel"
        @ok="BindAuthorOk"
      />

      <!--绑定演员-->
      <bind-models
        ref="BindModels"
        :visible="bind_models_visible"
        :loading="confirmLoading"
        :model="bind_models_mdl"
        @cancel="BindModelsCancel"
        @ok="BindModelsOk"
      />

      <!--添加视频到表单-->
      <add-to-form
        ref="AddToForm"
        :visible="add_to_form_visible"
        :loading="confirmLoading"
        :model="add_to_form_mdl"
        @cancel="AddToFormCancel"
        @ok="AddToFormOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getVideoList, setVideoState, setCategoryState, BindVideoToSection, setPayType, bindVideoAuthor, bindVideoModels, getVideoInfo, editVideo, addVideoToForm } from '@/api/manage'

import BindVideo from './modules/BindVideo'
import BindAuthor from './modules/BindAuthor'
import BindModels from './modules/BindModels'
import SetPayType from './modules/SetPayType'
import EditVideo from './modules/EditVideo'
import AddToForm from './modules/AddToForm'

const columns = [
  /*
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
  */

  {
    title: '标题',
    dataIndex: 'title'
    // scopedSlots: { customRender: 'link_type' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '短视频'
      } else if (text === 1) {
        str = '长视频'
      }
      return str
    }
  },
  {
    title: '分类',
    dataIndex: 'categories',
    scopedSlots: { customRender: 'join' }
  },
  {
    title: '分区',
    dataIndex: 'section',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '标签',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'join' }
  },
  {
    title: '支付方式',
    dataIndex: 'pay_type',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '免费'
      } else if (text === 1) {
        str = '金币购买'
      } else if (text === 2) {
        str = 'vip'
      }
      return str
    }
  },
  {
    title: '来源',
    dataIndex: 'origin',
    customRender: (text) => text
  },
  {
    title: '金币',
    dataIndex: 'coin',
    customRender: (text) => text
  },
  {
    title: '时长',
    dataIndex: 'duration',
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
      return text.nickname
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
    BindVideo,
    BindAuthor,
    BindModels,
    SetPayType,
    EditVideo,
    AddToForm,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    this.sectionColumns = sectionColumns
    return {
      // create model
      section_id: '',
      video_id: '',
      category_title: '',
      visible: false,
      video_visible: false,
      bind_video_visible: false,
      edit_video_visible: false,
      set_pay_type_visible: false,
      bind_author_visible: false,
      bind_models_visible: false,
      add_to_form_visible: false,
      confirmLoading: false,
      mdl: null,
      bind_video_mdl: null,
      set_pay_type_mdl: null,
      bind_author_mdl: null,
      bind_models_mdl: null,
      edit_video_mdl: null,
      add_to_form_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getVideoList(requestParameters)
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
    },
    joinFilter (text) {
      let str = ''
      for (var i = 0; i < text.length; i++) {
        str += text[i] + ';'
      }

      return str
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
    // 绑定到分区
    bindToSection (record) {
      this.video_id = record._id
      this.bind_video_visible = true
    },
    // 编辑视频
    editVideo (record) {
      // 获取视频信息
      this.video_id = record._id
      const param = { video_id: record._id }
      getVideoInfo(param).then(res => {
        this.edit_video_visible = true
        this.edit_video_mdl = { ...res.data }
      })
    },
    setPayType (record) {
      this.video_id = record._id
      this.set_pay_type_mdl = { ...record }
      this.set_pay_type_visible = true
    },
    bindAuthor (record) {
      this.video_id = record._id
      this.bind_author_mdl = { ...record }
      this.bind_author_visible = true
    },
    bindModels (record) {
      this.video_id = record._id
      this.bind_models_mdl = { ...record }
      this.bind_models_visible = true
    },
    AddToForm (record) {
      this.video_id = record._id
      this.add_to_form_mdl = { ...record }
      this.add_to_form_visible = true
    },
    deleteVideo (record) {
      // const param = { category: id, status: state }
      // const table = this.$refs.table
      // const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要删除该视频吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          /*
          setCategoryState(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('分类' + str + '成功')
            } else {
              message.info('分类' + str + '失败')
            }
          })
           */
        }
      })
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
    BindVideoOk () {
      const form = this.$refs.BindVideo.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          // console.log('values', values)

          BindVideoToSection(values).then(res => {
            this.bind_video_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('绑定视频到分区成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    // 编辑视频
    EditVideoOk () {
      const form = this.$refs.EditVideo.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id

          editVideo(values).then(res => {
            this.edit_video_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('编辑视频成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    SetPayTypeOk () {
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
    BindAuthorOk () {
      const form = this.$refs.BindAuthor.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          bindVideoAuthor(values).then(res => {
            this.confirmLoading = false
            this.bind_author_visible = false

            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('绑定作者成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.bind_author_visible = false
    },
    BindModelsOk () {
      const form = this.$refs.BindModels.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          console.log(values)

          bindVideoModels(values).then(res => {
            this.confirmLoading = false
            this.bind_models_visible = false

            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('绑定演员成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.bind_author_visible = false
    },
    AddToFormOk () {
      const form = this.$refs.AddToForm.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          console.log('***')
          console.log(values)

          addVideoToForm(values).then(res => {
            this.confirmLoading = false
            this.add_to_form_visible = false

            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加视频到表单成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.bind_author_visible = false
    },
    BindVideoCancel () {
      this.confirmLoading = false
      this.bind_video_visible = false
    },
    EditVideoCancel () {
      this.confirmLoading = false
      this.edit_video_visible = false
    },
    SetPayTypeCancel () {
      this.confirmLoading = false
      this.set_pay_type_visible = false
    },
    BindAuthorCancel () {
      this.confirmLoading = false
      this.bind_author_visible = false
    },
    BindModelsCancel () {
      this.confirmLoading = false
      this.bind_models_visible = false
    },
    AddToFormCancel () {
      this.confirmLoading = false
      this.add_to_form_visible = false
    },
    setVideoState (id, state) {
      // 设置上架下架
      let str
      if (state === 1) {
        str = '上架'
      } else if (state === 0) {
        str = '下架'
      }

      const param = { video_id: id, status: state }
      const table = this.$refs.table
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要将该视频' + str + '吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          setVideoState(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('视频' + str + '成功')
            } else {
              message.info('视频' + str + '失败')
            }
          })
        }
      })
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
