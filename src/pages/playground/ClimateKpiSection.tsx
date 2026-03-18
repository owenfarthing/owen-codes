import { useMemo } from 'react'
import { motion } from 'motion/react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useFetch } from '@/hooks/useFetch'
import { DATA_SOURCES } from '@/data/sources'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { KpiCard } from '@/components/ui/KpiCard'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './ClimateKpiSection.module.css'

interface ClimateResponse {
  current_weather: {
    temperature: number
    windspeed: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

const lat = import.meta.env.VITE_DEFAULT_LAT || '30.33'
const lon = import.meta.env.VITE_DEFAULT_LON || '-81.66'

const FETCH_URL = `${DATA_SOURCES.climate.endpoint}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,windspeed_10m&current_weather=true&timezone=America/New_York&forecast_days=1&temperature_unit=fahrenheit&windspeed_unit=mph`

export function ClimateKpiSection() {
  const { data, loading } = useFetch<ClimateResponse>(FETCH_URL)

  const kpis = useMemo(() => {
    if (!data) return null
    const temps = data.hourly.temperature_2m
    return {
      current: Math.round(data.current_weather.temperature),
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      wind: Math.round(data.current_weather.windspeed),
    }
  }, [data])

  const chartData = useMemo(() => {
    if (!data) return []
    return data.hourly.time.map((t, i) => {
      const d = new Date(t)
      return {
        hour: d.toLocaleTimeString('en-US', { hour: 'numeric' }),
        hourIndex: d.getHours(),
        temp: data.hourly.temperature_2m[i],
      }
    })
  }, [data])

  const everyTwoHourTicks = useMemo(
    () => chartData.filter(d => d.hourIndex % 2 === 0).map(d => d.hour),
    [chartData]
  )

  if (loading) {
    return (
      <>
        <SectionHeader
          badge="KPI + CHART"
          title="The Weather Right Now (and Then)"
          subtitle={`${DATA_SOURCES.climate.name} · ${DATA_SOURCES.climate.license}`}
          sourceUrl={DATA_SOURCES.climate.url}
        />
        <div className={styles.kpiGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="float-card" style={{ height: 100 }}>
              <div className="skeleton" style={{ height: '100%', borderRadius: 16 }} />
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <SectionHeader
        badge="KPI + CHART"
        title="The Weather Right Now (and Then)"
        subtitle={`${DATA_SOURCES.climate.name} · ${DATA_SOURCES.climate.license}`}
        sourceUrl={DATA_SOURCES.climate.url}
      />
      {kpis && (
        <motion.div className={styles.kpiGrid} variants={childVariants}>
          <KpiCard label="Current" value={kpis.current} unit="°F" />
          <KpiCard label="Today's High" value={kpis.high} unit="°F" />
          <KpiCard label="Today's Low" value={kpis.low} unit="°F" />
          <KpiCard label="Wind Speed" value={kpis.wind} unit="mph" />
        </motion.div>
      )}
      {chartData.length > 0 && (
        <motion.div className={`float-card ${styles.chartCard}`} variants={childVariants}>
          <div className={styles.chartTitle}>Hourly Temperature</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="hour"
                ticks={everyTwoHourTicks}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                padding={{ left: 16 }}
              />
              <YAxis
                tickFormatter={(v: number) => `${v}°F`}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-float)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="var(--text-accent)"
                strokeWidth={2}
                dot={false}
                name="Temperature (°F)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
      <p className={"attribution"}>
        Data from {DATA_SOURCES.climate.name} · {DATA_SOURCES.climate.license}
      </p>
    </>
  )
}
