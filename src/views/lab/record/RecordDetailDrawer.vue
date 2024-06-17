<template>
  <a-drawer v-model:visible="visible" title="记录管理详情" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="记录id">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="实验室id">{{ dataDetail?.labId }}</a-descriptions-item>
      <a-descriptions-item label="用户id">{{ dataDetail?.userId }}</a-descriptions-item>
      <a-descriptions-item label="检查日期">{{ dataDetail?.inspectionDate }}</a-descriptions-item>
      <a-descriptions-item label="门窗完好及关闭">{{ dataDetail?.door }}</a-descriptions-item>
      <a-descriptions-item label="门窗完好及关闭情况">{{ dataDetail?.doorMemo }}</a-descriptions-item>
      <a-descriptions-item label="消防设备是否存在">{{ dataDetail?.fireDeviceExist }}</a-descriptions-item>
      <a-descriptions-item label="消防设备是否存在情况">{{ dataDetail?.fireDeviceExistMemo }}</a-descriptions-item>
      <a-descriptions-item label="消防设施是否有效">{{ dataDetail?.fireDeviceValid }}</a-descriptions-item>
      <a-descriptions-item label="消防设施是否有效情况">{{ dataDetail?.fireDeviceValidMemo }}</a-descriptions-item>
      <a-descriptions-item label="其他安全隐患">{{ dataDetail?.otherRisks }}</a-descriptions-item>
      <a-descriptions-item label="问题处理0-未上报 1-已上报 2-已处理">{{ dataDetail?.problemHandling }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { type RecordDetailResp, getRecord } from '@/apis'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<RecordDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getRecord(dataId.value)
  dataDetail.value = res.data
}

// 打开详情
const onDetail = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onDetail })
</script>

<style lang="scss" scoped></style>
