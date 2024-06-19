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
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { addRecord, getRecord, updateRecord } from '@/apis'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改记录管理' : '新增记录管理'))
const formRef = ref<InstanceType<typeof GiForm>>()

const { fire_device_exist_enum } = useDict('fire_device_exist_enum')
const { fire_device_valid } = useDict('fire_device_valid')
const { problem_handling_enum } = useDict('problem_handling_enum')

const options: Options = {
  form: {},
  col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  btns: { hide: true }
}

const columns: Columns = [
  {
    label: '实验室id',
    field: 'labId',
    type: 'input',
    rules: [{ required: true, message: '请输入实验室id' }]
  },
  {
    label: '消防设备是否存在',
    field: 'fireDeviceExist',
    type: 'select',
    options: fire_device_exist_enum as any
  },
  {
    label: '消防设备是否存在情况',
    field: 'fireDeviceExistMemo',
    type: 'input'
  },
  {
    label: '消防设施是否有效',
    field: 'fireDeviceValid',
    type: 'select',
    options: fire_device_valid
  },
  {
    label: '消防设施是否有效情况',
    field: 'fireDeviceValidMemo',
    type: 'input'
  },
  {
    label: '其他安全隐患',
    field: 'otherRisks',
    type: 'input'
  },
  {
    label: '问题处理情况',
    field: 'problemHandling',
    type: 'select',
    options: problem_handling_enum
  },
  {
    label: '检查日期',
    field: 'inspectionDate',
    type: 'date-picker'
  }
]

const { form, resetForm } = useForm({
  // todo 待补充
})

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
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
  const res = await getRecord(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
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

defineExpose({ onAdd, onUpdate })
</script>
