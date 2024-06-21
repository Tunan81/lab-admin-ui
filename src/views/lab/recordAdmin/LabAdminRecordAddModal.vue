<template>
  <a-modal
      v-model:visible="visible"
      :title="title"
      :mask-closable="false"
      :esc-to-close="false"
      :modal-style="{ maxWidth: '600px' }"
      width="90%"
      @before-ok="save"
      @close="reset"
  >
    <!--    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" /> -->
    <a-form :model="form" :auto-label-width="true" layout="horizontal">
      <a-space direction="vertical" :style="{ width: '300px' }" style="margin: 0 auto">
        <!--        <a-form-item label="实验室名称" field="labName"> -->
        <!--          <a-input v-model="form.labName" placeholder="请输入实验室id" /> -->
        <!--        </a-form-item> -->
        <a-form-item field="labName" :style="{ width: '300px' }" label="实验室名称">
          <a-select v-model="form.labName" allow-search placeholder="请选择实验室" :filter-option="false" :loading="loading" @change="handleChange">
            <a-option v-for="item of options" :key="item.id" :value="item.name">{{ item.name }}</a-option>
          </a-select>
        </a-form-item>
        <!--        <a-form-item v-if="!isLabAdmin" label="维护人员姓名" field="userName"> -->
        <!--          <a-input v-model="form.userName" placeholder="请输入维护人员姓名" /> -->
        <!--        </a-form-item> -->
        <a-form-item label="门窗状态" field="door" :style="{ width: '300px' }">
          <a-select v-model="form.door" placeholder="请选择门窗状态">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.door === 1" label="门窗状态情况" field="doorMemo">
          <a-input v-model="form.doerMemo" placeholder="请输入门窗状态情况" />
        </a-form-item>
        <a-form-item label="消防设备是否存在" field="fireDeviceExist" :style="{ width: '300px' }">
          <a-select v-model="form.fireDeviceExist" placeholder="请选择消防设备是否存在">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.fireDeviceExist === 1" label="消防设备是否存在情况" name="fireDeviceExistMemo">
          <a-input v-model="form.fireDeviceExistMemo" placeholder="请输入消防设备是否存在情况" />
        </a-form-item>
        <a-form-item label="消防设备是否过期" field="fireDeviceValid" :style="{ width: '300px' }">
          <a-select v-model="form.fireDeviceValid" placeholder="请选择消防设备是否过期">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.fireDeviceValid === 1" label="消防设备过期情况" name="fireDeviceValidMemo">
          <a-input v-model="form.fireDeviceValidMemo" placeholder="请输入消防设备过期情况" />
        </a-form-item>
        <a-form-item label="其他安全隐患" name="otherRisks">
          <a-input v-model="form.otherRisks" placeholder="请输入其他安全隐患" />
        </a-form-item>
        <a-form-item label="问题处理情况" field="problemHandling" :style="{ width: '300px' }">
          <a-select v-model="form.problemHandling" placeholder="请选择问题处理情况">
            <a-option :value="0">未上报</a-option>
            <a-option :value="1">已上报</a-option>
            <a-option :value="2">已处理</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="检查日期" field="fireDeviceValid" :style="{ width: '300px' }">
          <a-date-picker
              v-model="form.inspectionDate"
              placeholder="请选择检查日期"
              format="YYYY-MM-DD"
              style="width: 100%"
          />
        </a-form-item>
      </a-space>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { addRecord, getRecord, listLabByLoginUser, updateRecord } from '@/apis'
import { useForm } from '@/hooks'

// 实验室管理员界面传入用户登录信息
const props = defineProps({
  userInfo: {
    type: Object,
    require: false
  } as any
})

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改记录管理' : '新增记录管理'))

const { form, resetForm } = useForm({
  // todo 待补充
  labName: '',
  userName: props.userInfo.username || '',
  userId: props.userInfo.id,
  door: 0,
  doerMemo: '',
  inspectionDate: '',
  fireDeviceExist: 0,
  fireDeviceExistMemo: '',
  fireDeviceValid: 0,
  fireDeviceValidMemo: '',
  otherRisks: '',
  problemHandling: '',
  labId: ''
})

// 重置
const reset = () => {
  // formRef.value?.formRef?.resetFields()
  resetForm()
}
const loading = ref(false)
const visible = ref(false)
const options = ref()
// 新增
const onAdd = async () => {
  const res = await listLabByLoginUser()
  options.value = res.data
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  const ress = await listLabByLoginUser()
  options.value = ress.data
  dataId.value = id
  const res = await getRecord(id)
  loading.value = false
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    // const isInvalid = await formRef.value?.formRef?.validate()
    // const isInvalid = false
    // if (isInvalid) return false
    if (isUpdate.value) {
      await updateRecord(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addRecord(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// const handleSearch = (value) => {
//   if (value) {
//     loading.value = true
//     window.setTimeout(async () => {
//       const res = await listLabByLoginUser(value)
//       options.value = res.data
//       loading.value = false
//     }, 1000)
//   } else {
//     options.value = []
//   }
// }

// 当选项改变时将实验室id赋值
const handleChange = (value) => {
  form.labName = toRaw(value).name
  form.labId = toRaw(value).id
}

defineExpose({ onAdd, onUpdate })
</script>
