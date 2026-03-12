import { Dropdown, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { DownOutlined, CheckCircleFilled } from '@ant-design/icons'
import styles from './index.module.scss'

interface Domain {
  domain_id: string
  name: string
  description?: string
}

interface DomainSwitcherProps {
  domainId: string
  domains: Domain[]
  currentLabel: string
  onDomainChange: (newDomainId: string) => void
}

export function DomainSwitcher({
  domainId,
  domains,
  currentLabel,
  onDomainChange,
}: DomainSwitcherProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: '_header',
      label: <div className={styles.menuHeader}>切换域</div>,
      type: 'group',
    },
    ...domains.map((d) => ({
      key: d.domain_id,
      label: (
        <div className={styles.menuItem}>
          <div className={styles.menuContent}>
            <div className={styles.menuRow}>
              <span className={styles.menuName}>{d.name || d.domain_id}</span>
              {d.domain_id === domainId && <CheckCircleFilled className={styles.checkIcon} />}
            </div>
            <span className={styles.menuId}>{d.domain_id}</span>
          </div>
        </div>
      ),
      onClick: () => onDomainChange(d.domain_id),
      className: d.domain_id === domainId ? styles.activeItem : '',
    })),
  ]

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomLeft"
      overlayClassName={styles.dropdown}
    >
      <button type="button" className={styles.trigger}>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{currentLabel}</span>
            <DownOutlined className={styles.chevron} />
          </div>
          <div className={styles.metaRow} onClick={(e) => e.stopPropagation()}>
            <Typography.Text
              copyable={{ text: domainId, tooltips: ['复制', '已复制'] }}
              className={styles.domainId}
            >
              {domainId}
            </Typography.Text>
          </div>
        </div>
      </button>
    </Dropdown>
  )
}
