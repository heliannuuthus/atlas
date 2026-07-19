import { useRequest } from 'ahooks'
import { ArrowUpRight, Cloud, FileCode2, Mail, Plus, Radio, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@atlas/ui/badge'
import { Button } from '@atlas/ui/button'
import { Card } from '@atlas/ui/card'
import { Progress } from '@atlas/ui/progress'
import { Skeleton } from '@atlas/ui/skeleton'
import { chaosTemplateApi, type EmailTemplate } from '@/services'
import styles from './index.module.scss'

export function Dashboard() {
  const navigate = useNavigate()
  const { data, loading } = useRequest(() => chaosTemplateApi.getList())
  const templates = (data as EmailTemplate[] | undefined) ?? []
  const enabled = templates.filter(template => template.is_enabled).length
  const builtIn = templates.filter(template => template.is_builtin).length
  const coverage = templates.length ? Math.round((enabled / templates.length) * 100) : 0

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><Radio /> DELIVERY CONTROL PLANE</div>
          <h1>让每一次投递，<br /><span>有迹可循。</span></h1>
          <p>集中管理邮件模板与对象存储，把内容生产、预览和分发收束到一个可靠入口。</p>
          <div className={styles.heroActions}>
            <Button size="lg" onClick={() => navigate('/templates/create')}><Plus />创建模板</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/files')}><UploadCloud />上传文件</Button>
          </div>
        </div>
        <div className={styles.orbit} aria-hidden="true">
          <div className={styles.orbitRing} />
          <div className={styles.core}><Mail /></div>
          <span className={styles.nodeOne}><FileCode2 /></span>
          <span className={styles.nodeTwo}><Cloud /></span>
          <span className={styles.nodeThree}><ArrowUpRight /></span>
        </div>
      </section>

      <section className={styles.metrics} aria-label="服务概览">
        <Card className={styles.metric}>
          <span className={styles.metricLabel}>模板资产</span>
          {loading ? <Skeleton className={styles.valueSkeleton} /> : <strong>{templates.length.toString().padStart(2, '0')}</strong>}
          <span>含 {builtIn} 个内置模板</span>
        </Card>
        <Card className={styles.metric}>
          <span className={styles.metricLabel}>启用模板</span>
          {loading ? <Skeleton className={styles.valueSkeleton} /> : <strong>{enabled.toString().padStart(2, '0')}</strong>}
          <div className={styles.progressRow}><Progress value={coverage} /><span>{coverage}%</span></div>
        </Card>
        <Card className={styles.metric}>
          <span className={styles.metricLabel}>邮件通道</span>
          <strong className={styles.statusValue}><i />在线</strong>
          <span>SMTP 服务连接正常</span>
        </Card>
        <Card className={styles.metric}>
          <span className={styles.metricLabel}>对象存储</span>
          <strong className={styles.storageValue}>R2</strong>
          <span>Cloudflare 全球存储</span>
        </Card>
      </section>

      <section className={styles.workspace}>
        <div className={styles.sectionHeading}>
          <div><span>WORKSPACE</span><h2>今天从这里开始</h2></div>
          <Button variant="ghost" onClick={() => navigate('/templates')}>查看全部模板 <ArrowUpRight /></Button>
        </div>
        <div className={styles.actionGrid}>
          <button type="button" className={styles.actionCard} onClick={() => navigate('/templates/create')}>
            <span className={styles.actionIndex}>01</span><span className={styles.actionIcon}><FileCode2 /></span>
            <strong>设计一封邮件</strong><p>使用 Go Template 变量创建可复用的 HTML 邮件。</p><ArrowUpRight className={styles.actionArrow} />
          </button>
          <button type="button" className={styles.actionCard} onClick={() => navigate('/files')}>
            <span className={styles.actionIndex}>02</span><span className={styles.actionIcon}><UploadCloud /></span>
            <strong>分发一个文件</strong><p>上传至 R2 并立即获得可复制的公开访问地址。</p><ArrowUpRight className={styles.actionArrow} />
          </button>
          <div className={styles.serviceCard}>
            <div className={styles.serviceTop}><Badge variant="secondary">SYSTEM NOTE</Badge><span>CHAOS / 01</span></div>
            <blockquote>“模板负责表达，存储负责抵达。Chaos 让两者共享同一条可靠的分发路径。”</blockquote>
            <div className={styles.serviceLine}><span>MAIL</span><i /><b>READY</b></div>
            <div className={styles.serviceLine}><span>STORAGE</span><i /><b>READY</b></div>
          </div>
        </div>
      </section>
    </div>
  )
}
