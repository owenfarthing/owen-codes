import { useState, useRef, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './DataTable.module.css'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  searchPlaceholder?: string
  filterColumn?: string
  filterOptions?: string[]
  loading?: boolean
  pageSize?: number
}

function FilterDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string
  options: string[]
  placeholder: string
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = value || placeholder

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        className={styles.dropdownTrigger}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span className={value ? styles.dropdownValueActive : styles.dropdownValue}>
          {label}
        </span>
        <ChevronDown size={14} className={`${styles.dropdownChevron} ${open ? styles.dropdownChevronOpen : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <li>
              <button
                className={`${styles.dropdownItem} ${!value ? styles.dropdownItemActive : ''}`}
                onClick={() => { onChange(''); setOpen(false) }}
                type="button"
              >
                {placeholder}
              </button>
            </li>
            {options.map(opt => (
              <li key={opt}>
                <button
                  className={`${styles.dropdownItem} ${value === opt ? styles.dropdownItemActive : ''}`}
                  onClick={() => { onChange(opt); setOpen(false) }}
                  type="button"
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  filterColumn,
  filterOptions,
  loading = false,
  pageSize = 20,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  return (
    <motion.div className={`float-card ${styles.wrapper}`} variants={childVariants}>
      <div className={styles.controls}>
        <input
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />
        {filterColumn && filterOptions && (
          <FilterDropdown
            value={(columnFilters.find(f => f.id === filterColumn)?.value as string) ?? ''}
            options={filterOptions}
            placeholder="All regions"
            onChange={val => {
              setColumnFilters(val
                ? [{ id: filterColumn!, value: val }]
                : []
              )
            }}
          />
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className={styles.sortIcon}>
                      {header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronDown size={14} />
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className={styles.skeletonRow}>
                    {columns.map((_, j) => (
                      <td key={j}>
                        <div
                          className={`skeleton ${styles.skeletonCell}`}
                          style={{ width: `${60 + Math.random() * 40}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  )
}
