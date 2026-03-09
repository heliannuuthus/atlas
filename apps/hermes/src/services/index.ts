import { hermesRequest as request } from '@atlas/shared'
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
} from '@/types'

export const domainApi = {
  getList: () => request.get<Domain[]>('/domains'),
  getDetail: (domainId: string) => request.get<Domain>(`/domains/${domainId}`),
}

export const serviceApi = {
  getList: (params?: { domain_id?: string }) =>
    request.get<Service[]>('/services', { params }),
  getDetail: (serviceId: string) => request.get<Service>(`/services/${serviceId}`),
  create: (data: ServiceCreateRequest) => request.post<Service>('/services', data),
  update: (serviceId: string, data: ServiceUpdateRequest) =>
    request.patch(`/services/${serviceId}`, data),
}

export const applicationApi = {
  getList: (params?: { domain_id?: string }) =>
    request.get<Application[]>('/applications', { params }),
  getDetail: (appId: string) => request.get<Application>(`/applications/${appId}`),
  create: (data: ApplicationCreateRequest) => request.post<Application>('/applications', data),
  update: (appId: string, data: ApplicationUpdateRequest) =>
    request.patch(`/applications/${appId}`, data),
  setServiceRelations: (appId: string, serviceId: string, data: ApplicationServiceRelationRequest) =>
    request.post(`/applications/${appId}/services/${serviceId}/applicable`, data),
  getServiceRelations: (appId: string) =>
    request.get<ApplicationServiceRelation[]>(`/applications/${appId}/applicable`),
}

export const relationshipApi = {
  getList: (params?: { service_id?: string; subject_type?: string; subject_id?: string }) =>
    request.get<Relationship[]>('/relationships', { params }),
  create: (data: RelationshipCreateRequest) => request.post<Relationship>('/relationships', data),
  delete: (data: RelationshipDeleteRequest) => request.delete('/relationships', { data }),
}

export const groupApi = {
  getList: () => request.get<Group[]>('/groups'),
  getDetail: (groupId: string) => request.get<Group>(`/groups/${groupId}`),
  create: (data: GroupCreateRequest) => request.post<Group>('/groups', data),
  update: (groupId: string, data: GroupUpdateRequest) => request.patch(`/groups/${groupId}`, data),
  setMembers: (groupId: string, data: GroupMemberRequest) =>
    request.post(`/groups/${groupId}/members`, data),
  getMembers: (groupId: string) => request.get<{ members: string[] }>(`/groups/${groupId}/members`),
}
