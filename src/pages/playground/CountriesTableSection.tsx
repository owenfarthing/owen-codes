import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useFetch } from '@/hooks/useFetch';
import { DATA_SOURCES } from '@/data/sources';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DataTable } from '@/components/ui/DataTable';


interface CountryRaw {
	name: { common: string };
	flag: string;
	population: number;
	region: string;
	subregion?: string;
	languages?: Record<string, string>;
	currencies?: Record<string, { name: string }>;
}

interface CountryRow {
	flag: string;
	name: string;
	population: number;
	region: string;
	subregion: string;
	languages: string;
	currency: string;
}

const FETCH_URL = `${DATA_SOURCES.countries.endpoint}?fields=name,flag,population,region,subregion,languages,currencies`;

const columns: ColumnDef<CountryRow, unknown>[] = [
	{ accessorKey: 'flag', header: '🏳️', enableSorting: false, size: 40 },
	{ accessorKey: 'name', header: 'Name' },
	{
		accessorKey: 'population',
		header: 'Population',
		cell: (info) => (info.getValue() as number).toLocaleString(),
	},
	{ accessorKey: 'region', header: 'Region' },
	{ accessorKey: 'subregion', header: 'Subregion' },
	{ accessorKey: 'languages', header: 'Languages' },
	{ accessorKey: 'currency', header: 'Currency' },
];
const EMPTY_DATA: CountryRow[] = [];

export function CountriesTableSection() {
	const { data: raw, loading } = useFetch<CountryRaw[]>(FETCH_URL);

	const rows = useMemo<CountryRow[]>(() => {
		if (!raw) return EMPTY_DATA;
		return raw.map((c) => ({
			flag: c.flag ?? '',
			name: c.name.common,
			population: c.population,
			region: c.region,
			subregion: c.subregion ?? '',
			languages: c.languages ? Object.values(c.languages).slice(0, 2).join(', ') : '',
			currency: c.currencies ? Object.values(c.currencies)[0]?.name ?? '' : '',
		}));
	}, [raw]);

	const regions = useMemo(() => {
		const set = new Set(rows.map((r) => r.region).filter(Boolean));
		return Array.from(set).sort();
	}, [rows]);

	return (
		<>
			<SectionHeader
				badge="TABLE"
				title="Every Country on Earth"
				subtitle={`${DATA_SOURCES.countries.name} · ${DATA_SOURCES.countries.license}`}
				sourceUrl={DATA_SOURCES.countries.url}
			/>
			<DataTable
				data={rows}
				columns={columns}
				searchPlaceholder="Search countries..."
				filterColumn="region"
				filterOptions={regions}
				loading={loading}
				pageSize={10}
			/>
			<p className={"attribution"}>
				Data from {DATA_SOURCES.countries.name} · {DATA_SOURCES.countries.license}
			</p>
		</>
	);
}
