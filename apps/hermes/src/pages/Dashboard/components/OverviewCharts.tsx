import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import type { Service } from '@/types'
import styles from '../index.module.scss'

interface OverviewChartsProps {
  serviceCount: number
  appCount: number
  relationshipCount: number
  groupCount: number
  services: Service[]
  relationshipCountByServiceId: Record<string, number>
  loading?: boolean
}

export function OverviewCharts({
  serviceCount,
  appCount,
  relationshipCount,
  groupCount,
  services,
  relationshipCountByServiceId,
  loading,
}: OverviewChartsProps) {
  const resourceChartRef = useRef<HTMLDivElement>(null)
  const relationChartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading || !resourceChartRef.current) return
    const data = [
      { value: serviceCount, name: '服务' },
      { value: appCount, name: '应用' },
      { value: relationshipCount, name: '关系' },
      { value: groupCount, name: '组' },
    ].filter((d) => d.value > 0)
    if (data.length === 0) return

    const chart = echarts.init(resourceChartRef.current)
    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, left: 'center' },
      color: ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b'],
      series: [
        {
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6 },
          label: { show: true, formatter: '{b}\n{c}' },
          data,
        },
      ],
    }
    chart.setOption(option)
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [loading, serviceCount, appCount, relationshipCount, groupCount])

  useEffect(() => {
    if (loading || !relationChartRef.current || services.length === 0) return

    const names = services.map((s) => s.name || s.service_id)
    const counts = services.map((s) => relationshipCountByServiceId[s.service_id] ?? 0)

    const chart = echarts.init(relationChartRef.current)
    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, top: 16, bottom: 32 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { rotate: names.length > 4 ? 25 : 0, fontSize: 11 },
      },
      yAxis: { type: 'value', name: '关系数', nameTextStyle: { fontSize: 11 } },
      series: [
        {
          type: 'bar',
          data: counts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#34d399' },
              { offset: 1, color: '#059669' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
    chart.setOption(option)
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [loading, services, relationshipCountByServiceId])

  if (loading) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>统计图表</h3>
        <div className={styles.chartShimmer} />
      </section>
    )
  }

  const hasResourceData = serviceCount + appCount + relationshipCount + groupCount > 0

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>统计图表</h3>
      <p className={styles.sectionDesc}>
        当前域下资源数量与各服务关系分布。
      </p>
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <div className={styles.chartLabel}>资源概览</div>
          {hasResourceData ? (
            <div ref={resourceChartRef} className={styles.chart} />
          ) : (
            <div className={styles.chartEmpty}>暂无数据</div>
          )}
        </div>
        <div className={styles.chartBox}>
          <div className={styles.chartLabel}>各服务关系数</div>
          {services.length > 0 ? (
            <div ref={relationChartRef} className={styles.chart} />
          ) : (
            <div className={styles.chartEmpty}>暂无服务</div>
          )}
        </div>
      </div>
    </section>
  )
}
