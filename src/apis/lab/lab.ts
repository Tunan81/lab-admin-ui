import http from '@/utils/http'

const BASE_URL = '/lab/lab'

export interface LabResp {
  id: string
  name: string
  userId: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface LabDetailResp {
  id: string
  name: string
  userId: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface LabQuery {
  name: string
  userId: string
  sort: Array<string>
}
export interface LabPageQuery extends LabQuery, PageQuery {}

/** @desc 查询实验室列表 */
export function listLab(query: LabPageQuery) {
  return http.get<PageRes<LabResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询实验室详情 */
export function getLab(id: string) {
  return http.get<LabDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增实验室 */
export function addLab(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改实验室 */
export function updateLab(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除实验室 */
export function deleteLab(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

// /** @desc 导出实验室 */
// export function exportLab(query: LabQuery) {
//   return http.download<any>(`${BASE_URL}/export`, query)
// }
