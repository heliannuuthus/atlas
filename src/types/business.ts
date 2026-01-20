export interface BusinessModule {
  id: string
  name: string
  icon: string
  path: string
  color?: string
  description?: string
  enabled: boolean
  order: number
}

export interface BusinessMenu {
  key: string
  label: string
  icon?: React.ReactNode
  path: string
  children?: BusinessMenu[]
}

export interface BusinessConfig {
  module: BusinessModule
  menus: BusinessMenu[]
  defaultPath: string
}
