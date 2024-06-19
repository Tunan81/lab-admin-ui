<template>
  <div class="table-page">
    <GiTable
        row-key="id"
        title="实验室管理"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :pagination="pagination"
        :disabled-tools="['size']"
        :disabled-column-keys="['name']"
        @refresh="search"
    >
      <template #custom-left>
        <a-input v-model="queryForm.name" placeholder="请输入实验室名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.deptName" placeholder="请输入所属学院" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.buildingName" placeholder="请输入所属建筑名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.userName" placeholder="请输入维护人员名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-button @click="reset">重置</a-button>
      </template>
      <template #custom-right>
        <a-button v-permission="['lab:lab:add']" type="primary" @click="onAdd">
          <template #icon>
            <icon-plus />
          </template>
          <span>新增</span>
        </a-button>
        <!--        <a-tooltip content="导出"> -->
        <!--          <a-button v-permission="['lab:lab:export']" class="gi_hover_btn-border" @click="onExport"> -->
        <!--            <template #icon> -->
        <!--              <icon-download /> -->
        <!--            </template> -->
        <!--          </a-button> -->
        <!--        </a-tooltip> -->
      </template>
      <template #name="{ record }">
        <a-link @click="onDetail(record)">{{ record.name }}</a-link>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['lab:lab:update']" @click="onUpdate(record)">修改</a-link>
          <a-link
              v-permission="['lab:lab:delete']"
              status="danger"
              :disabled="record.disabled"
              @click="onDelete(record)"
          >
            删除
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <LabAddModal ref="LabAddModalRef" @save-success="search" />
    <LabDetailDrawer ref="LabDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import LabAddModal from './LabAddModal.vue'
import LabDetailDrawer from './LabDetailDrawer.vue'
import { type LabQuery, type LabResp, deleteLab, listLab } from '@/apis'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'Lab' })

const queryForm = reactive<LabQuery>({
  name: '',
  userName: '',
  buildingName: '',
  deptName: '',
  sort: ['createTime,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listLab({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  { title: '名称', dataIndex: 'name', slotName: 'name' },
  { title: '所属建筑', dataIndex: 'buildingName', slotName: 'buildingName' },
  { title: '所属部门', dataIndex: 'deptName', slotName: 'deptName' },
  // { title: '维护人员ID', dataIndex: 'userId', slotName: 'userId' },
  { title: '维护人员姓名', dataIndex: 'userName', slotName: 'userName' },
  { title: '修改时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: '操作',
    slotName: 'action',
    width: 130,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['lab:lab:update', 'lab:lab:delete'])
  }
]

// 重置
const reset = () => {
  queryForm.name = ''
  queryForm.deptName = ''
  queryForm.userName = ''
  queryForm.buildingName = ''
  search()
}

// 删除
const onDelete = (item: LabResp) => {
  return handleDelete(() => deleteLab(item.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// // 导出
// const onExport = () => {
//   useDownload(() => exportLab(queryForm))
// }

const LabAddModalRef = ref<InstanceType<typeof LabAddModal>>()
// 新增
const onAdd = () => {
  LabAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (item: LabResp) => {
  LabAddModalRef.value?.onUpdate(item.id)
}

const LabDetailDrawerRef = ref<InstanceType<typeof LabDetailDrawer>>()
// 详情
const onDetail = (item: LabResp) => {
  LabDetailDrawerRef.value?.onDetail(item.id)
}
</script>

<style lang="scss" scoped></style>
