/**
 * 管理后台相关类型定义
 */

export interface Domain {
  _id: number
  domain_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Service {
  _id: number
  service_id: string
  domain_id: string
  name: string
  description?: string
  access_token_expires_in: number
  refresh_token_expires_in: number
  status: number
  created_at: string
  updated_at: string
}

export interface Application {
  _id: number
  domain_id: string
  app_id: string
  name: string
  redirect_uris?: string
  created_at: string
  updated_at: string
}

export interface ApplicationServiceRelation {
  _id: number
  app_id: string
  service_id: string
  relation: string
  created_at: string
}

export interface Relationship {
  _id: number
  service_id: string
  subject_type: string
  subject_id: string
  relation: string
  object_type: string
  object_id: string
  created_at: string
  expires_at?: string
}

export interface Group {
  _id: number
  group_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ServiceCreateRequest {
  service_id: string
  domain_id: string
  name: string
  description?: string
  access_token_expires_in?: number
  refresh_token_expires_in?: number
}

export interface ServiceUpdateRequest {
  name?: string
  description?: string
  access_token_expires_in?: number
  refresh_token_expires_in?: number
  status?: number
}

export interface ApplicationCreateRequest {
  domain_id: string
  app_id: string
  name: string
  redirect_uris?: string[]
  need_key?: boolean
}

export interface ApplicationUpdateRequest {
  name?: string
  redirect_uris?: string[]
}

export interface ApplicationServiceRelationRequest {
  app_id: string
  service_id: string
  relations: string[]
}

export interface RelationshipCreateRequest {
  service_id: string
  subject_type: string
  subject_id: string
  relation: string
  object_type: string
  object_id: string
  expires_at?: string
}

export interface RelationshipDeleteRequest {
  service_id: string
  subject_type: string
  subject_id: string
  relation: string
  object_type: string
  object_id: string
}

export interface GroupCreateRequest {
  group_id: string
  name: string
  description?: string
}

export interface GroupUpdateRequest {
  name?: string
  description?: string
}

export interface GroupMemberRequest {
  group_id: string
  user_ids: string[]
}

export interface ListServicesParams {
  domain_id?: string
}

export interface ListApplicationsParams {
  domain_id?: string
}

export interface ListRelationshipsParams {
  service_id?: string
  subject_type?: string
  subject_id?: string
}
