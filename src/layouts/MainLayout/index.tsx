import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import styles from './index.module.scss'

const { Content } = Layout

export function MainLayout() {
  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout>
        <Sidebar />
        <Layout className={styles.contentLayout}>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
