// Hermes 身份与访问管理类型定义

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
  encrypted_key?: string // 后端通常不返回，前端不需要
  access_token_expires_in: number
  refresh_token_expires_in: number
  status: number // 0=active, 1=disabled
  created_at: string
  updated_at: string
}

export interface Application {
  _id: number
  domain_id: string
  app_id: string
  name: string
  redirect_uris?: string[] // JSON 数组字符串或数组
  encrypted_key?: string[] // 后端通常不返回
  created_at: string
  updated_at: string
}

export interface Relationship {
  _id: number
  service_id: string
  subject_type: 'user' | 'group' | 'application'
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

export interface ApplicationServiceRelation {
  service_id: string
  relations: string[] // ["*"] 表示全部
}

// 请求类型
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
  subject_type: 'user' | 'group' | 'application'
  subject_id: string
  relation: string
  object_type: string
  object_id: string
  expires_at?: string // ISO 8601 格式
}

export interface RelationshipUpdateRequest {
  service_id: string
  subject_type: 'user' | 'group' | 'application'
  subject_id: string
  relation: string // 旧的关系类型
  object_type: string
  object_id: string
  new_relation?: string // 新的关系类型
  expires_at?: string | null // ISO 8601 格式，null 表示清除
}

export interface RelationshipDeleteRequest {
  service_id: string
  subject_type: 'user' | 'group' | 'application'
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
