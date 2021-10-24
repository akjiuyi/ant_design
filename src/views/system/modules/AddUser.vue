<template>
  <a-modal
    title="添加账号"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="账号">
          <a-input placeholder="输入账号"  v-decorator="['username', [{required: true, min: 1, message: '请输入账号！'}]]" />
        </a-form-item>

        <a-form-item label="密码">
          <a-input placeholder="输入密码" type="password" v-decorator="['password', {rules: [{required: true, min:6, message: '请输入至少6位密码'},{validator: handlePass}]}]" />
        </a-form-item>

        <a-form-item label="确认密码">
          <a-input placeholder="输入确认密码" type="password" v-decorator="['repassword', {rules: [{required: true, min:6, message: '请输入确认密码'},{validator: handleConfirmPass}]}]" />
        </a-form-item>

        <a-form-item label="选择角色">
          <a-select v-decorator="['role_id', {rules: [{required: true, message: '选择角色'}]}]" placeholder="选择角色">
            <a-select-option :key="index" v-for="(role, index) in roles" :value="role._id">{{ role.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'

const fields = ['username', 'password', 'repassword', 'role_id', 'roles']

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
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      roles: []
    }
  },
  created () {
    console.log('custom modal created')
    // 防止表单未注册
     fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.roles = this.model.roles
    })
  },
  methods: {
    handlePass (rule, value, callback) {
      this.password = value
      callback()
    },
    handleConfirmPass (rule, value, callback) {
      if (this.password && this.password !== value) {
        const err = '两次密码输入不一致！'
        callback(err)
      }

      callback()
    }
  }
}
</script>
