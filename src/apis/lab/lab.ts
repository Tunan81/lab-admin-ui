import http from '@/utils/http'

const BASE_URL = '/lab/lab'

export interface LabResp {
  id: string
  name: string
  userId: string
  buildingName: string
  deptId: string
  deptName: string
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
  buildingName: string
  deptId: string
  deptName: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface UserListResp {
  id: string
  username: string
}
export interface LabList {
  id: string
  name: string
}
export interface LabQuery {
  name: string
  userName: string
  buildingName: string
  deptName: string
  sort: Array<string>
}
export interface LabPageQuery extends LabQuery, PageQuery {}

/** @desc 查询实验室列表 */
export function listLab(query: LabPageQuery) {
  return http.get<PageRes<LabResp[]>>(`${BASE_URL}`, query)
}

export function listLabByLoginUser() {
  return http.get<LabList[]>(`${BASE_URL}/loginUser`)
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

/** @desc 根据用户名查询用户list */
export function selectUserListByName(userName: string) {
  return http.get<UserListResp[]>(`${BASE_URL}/user/${userName}`)
}
// /** @desc 导出实验室 */
// export function exportLab(query: LabQuery) {
//   return http.download<any>(`${BASE_URL}/export`, query)
// }
