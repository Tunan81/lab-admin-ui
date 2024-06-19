<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '520px' }"
    width="90%"
    @before-ok="save"
    @close="reset"
  >
<!--    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" /> -->
    <a-form :model="form" :auto-label-width="true" layout="horizontal">
      <a-space direction="vertical" size="large" style="align-items: center">
        <a-form-item field="name" label="实验室名称">
          <a-input v-model="form.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item field="buildingName" label="所属建筑">
          <a-input v-model="form.buildingName" placeholder="请输入所属建筑名称" />
        </a-form-item>
        <a-form-item field="deptName" label="所属学院">
          <a-input v-model="form.deptName" placeholder="请输入所属学院名称" />
        </a-form-item>
        <a-form-item field="userId" :style="{ width: '300px' }" label="管理人员">
          <a-select v-model="form.userName" allow-search :filter-option="false" :loading="loading" placeholder="Please select ..."
                     @search="handleSearch" @change="handleChange">
            <a-option v-for="item of options" v-bind="item.userId" :value="item">{{ item.username }}</a-option>
          </a-select>
        </a-form-item>
      </a-space>
    </a-form>
</a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { addLab, getLab, selectUserListByName, updateLab } from '@/apis'
// import type { type Columns, GiForm, type Options } from '@/components/GiForm'

import { useForm } from '@/hooks'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改实验室' : '新增实验室'))

// const formRef = ref<InstanceType<typeof GiForm>>()

// const options: Options = {
//   form: {},
//   col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
//   btns: { hide: true }
// }
//
// const columns: Columns = [
//   {
//     label: '名称',
//     field: 'name',
//     type: 'input',
//     rules: [{ required: true, message: '请输入' }]
//   },
//   {
//     label: '所属建筑名称',
//     field: 'buildingName',
//     type: 'input',
//     rules: [{ required: true, message: '请输入' }]
//   },
//   {
//     label: '维护人员ID',
//     field: 'userId',
//     type: 'select'
//   }
// ]

const { form, resetForm } = useForm({
  userId: '',
  name: '',
  buildingName: '',
  deptName: '',
  userName: ''
})

const options = ref()
const loading = ref(false)

const handleSearch = (value) => {
  if (value) {
    loading.value = true
    window.setTimeout(async () => {
      const res = await selectUserListByName(value)
      options.value = res.data
      loading.value = false
    }, 2000)
  } else {
    options.value = []
  }
}

const handleChange = (value) => {
  const selectedUser = options.value.find((item) => item.username === value)
  if (selectedUser) {
    form.userId = selectedUser.userId
  }
}

// 重置
const reset = () => {
  // formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = () => {
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const res = await getLab(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    // const isInvalid = await formRef.value?.formRef?.validate()
    const isInvalid = false
    if (isInvalid) return false
    if (isUpdate.value) {
      console.log(form.userId)
      await updateLab(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addLab(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

defineExpose({ onAdd, onUpdate })
</script>
