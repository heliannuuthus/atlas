import request from '@/utils/request'
import type {
  Miniprogram,
  MiniprogramListParams,
  MiniprogramListResponse,
} from '@/types/miniprogram'
import type {
  Domain,
  Service,
  Application,
  ApplicationServiceRelation,
  Relationship,
  Group,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
  ApplicationServiceRelationRequest,
  RelationshipCreateRequest,
  RelationshipDeleteRequest,
  GroupCreateRequest,
  GroupUpdateRequest,
  GroupMemberRequest,
  ListServicesParams,
  ListApplicationsParams,
  ListRelationshipsParams,
} from '@/types/management'

export const miniprogramApi = {
  getList: (params: MiniprogramListParams) =>
    request.get<MiniprogramListResponse>('/miniprogram', { params }),

  getDetail: (id: string) =>
    request.get<Miniprogram>(`/miniprogram/${id}`),

  create: (data: Partial<Miniprogram>) =>
    request.post<Miniprogram>('/miniprogram', data),

  update: (id: string, data: Partial<Miniprogram>) =>
    request.put<Miniprogram>(`/miniprogram/${id}`, data),

  delete: (id: string) =>
    request.delete<void>(`/miniprogram/${id}`),

  publish: (id: string) =>
    request.post<Miniprogram>(`/miniprogram/${id}/publish`),
}

export const authApi = {
  login: (code: string, idp: string) =>
    request.post<{ access_token: string; refresh_token: string }>('/token', {
      grant_type: 'authorization_code',
      code,
      idp,
    }),

  refreshToken: (refreshToken: string) =>
    request.post<{ access_token: string; refresh_token: string }>('/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),

  logout: () => request.post('/revoke'),

  logoutAll: () => request.post('/revoke-all'),

  getProfile: () => request.get('/user/profile'),

  updateProfile: (data: Record<string, unknown>) =>
    request.put('/user/profile', data),
}

export const tenantApi = {
  getList: () => request.get('/tenants'),

  getDetail: (id: string) => request.get(`/tenants/${id}`),

  create: (data: Record<string, unknown>) =>
    request.post('/tenants', data),

  update: (id: string, data: Record<string, unknown>) =>
    request.put(`/tenants/${id}`, data),

  delete: (id: string) => request.delete(`/tenants/${id}`),
}

export const domainApi = {
  getList: () => request.get<Domain[]>('/hermes/domains'),

  getDetail: (domainId: string) =>
    request.get<Domain>(`/hermes/domains/${domainId}`),
}

export const serviceApi = {
  getList: (params?: ListServicesParams) =>
    request.get<Service[]>('/hermes/services', { params }),

  getDetail: (serviceId: string) =>
    request.get<Service>(`/hermes/services/${serviceId}`),

  create: (data: ServiceCreateRequest) =>
    request.post<Service>('/hermes/services', data),

  update: (serviceId: string, data: ServiceUpdateRequest) =>
    request.patch(`/hermes/services/${serviceId}`, data),
}

export const applicationApi = {
  getList: (params?: ListApplicationsParams) =>
    request.get<Application[]>('/hermes/applications', { params }),

  getDetail: (appId: string) =>
    request.get<Application>(`/hermes/applications/${appId}`),

  create: (data: ApplicationCreateRequest) =>
    request.post<Application>('/hermes/applications', data),

  update: (appId: string, data: ApplicationUpdateRequest) =>
    request.patch(`/hermes/applications/${appId}`, data),

  setServiceRelations: (
    appId: string,
    serviceId: string,
    data: ApplicationServiceRelationRequest
  ) =>
    request.post(
      `/hermes/applications/${appId}/services/${serviceId}/relations`,
      data
    ),

  getServiceRelations: (appId: string) =>
    request.get<ApplicationServiceRelation[]>(
      `/hermes/applications/${appId}/relations`
    ),
}

export const relationshipApi = {
  getList: (params?: ListRelationshipsParams) =>
    request.get<Relationship[]>('/hermes/relationships', { params }),

  create: (data: RelationshipCreateRequest) =>
    request.post<Relationship>('/hermes/relationships', data),

  delete: (data: RelationshipDeleteRequest) =>
    request.delete('/hermes/relationships', { data }),
}

export const groupApi = {
  getList: () => request.get<Group[]>('/hermes/groups'),

  getDetail: (groupId: string) =>
    request.get<Group>(`/hermes/groups/${groupId}`),

  create: (data: GroupCreateRequest) =>
    request.post<Group>('/hermes/groups', data),

  update: (groupId: string, data: GroupUpdateRequest) =>
    request.patch(`/hermes/groups/${groupId}`, data),

  setMembers: (groupId: string, data: GroupMemberRequest) =>
    request.post(`/hermes/groups/${groupId}/members`, data),

  getMembers: (groupId: string) =>
    request.get<{ members: string[] }>(`/hermes/groups/${groupId}/members`),
}
