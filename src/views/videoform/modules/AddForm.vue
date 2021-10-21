<template>
  <a-modal
    title="添加视频表单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout" enctype="multipart/form-data">
        <!--标题-->
        <a-form-item  label="标题">
          <a-input placeholder="请输入标题" v-decorator="['title', {rules: [{required: true, message: '请输入标题！'}]} ]" />
        </a-form-item>

        <!--描述-->
        <a-form-item  label="描述">
          <a-input placeholder="请输入描述" v-decorator="['des', {rules: [{required: true, message: '请输入描述！'}]}]" />
        </a-form-item>

        <!--图片上传-->
        <!--
        <a-form-item label="图片上传">
          <a-upload
            name="pic"
            :data="upload_data"
            :headers="upload_header"
            method="PATCH"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="upload_url"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-input type="hidden" v-decorator="['pic', {rules: [{required: true,  message: '请上传视频'}]}]"/>
            <img v-if="imageUrl" :src="imageUrl"  alt="pic" style="width: 6rem;"/>
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['title', 'des']

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
      form: this.$form.createForm(this),
      imageUrl: '',
      uploading: false,
      upload_data: {},
      upload_header: {},
      upload_url: process.env.VUE_APP_UPLOAD_API_URL + 'backend-api/list'
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      // this.upload_data = { title: this.form.getFieldValue('title'), des: this.form.getFieldValue('des') }
      // this.upload_header = { token: storage.get(ACCESS_TOKEN) }
    })
  }
}
</script>
