<template>
  <a-modal
    title="更改用户组"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--更改用户组-->
        <a-form-item label="用户组">
          <a-select show-search placeholder="请选择一个用户组" option-filter-prop="children" v-decorator="['group', {rules: [{required: true, message: '请选择用户组！'}]}]" @blur="getGroup">
            <a-select-option value="0">
              游客
            </a-select-option>
            <a-select-option value="1" >
              原创个人
            </a-select-option>
            <a-select-option value="2">
              原创大神
            </a-select-option>
            <a-select-option value="3">
              专业工作室
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['group']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      const obj = pick(this.model, fields)
      obj.group = obj.group.toString()
      this.model && this.form.setFieldsValue(obj)
    })
  }
}
</script>
