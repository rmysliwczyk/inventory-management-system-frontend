import type { Dayjs } from 'dayjs'

export interface User {
	username: string | undefined
	token: string
	role: 'ADMIN' | 'USER'
}

export interface AssetDetails {
	id: string
	description: string
	acquisition_date: string
}

export interface NewAssetDetails {
	description: string | null
	acquisition_date: Dayjs | string
	asset_type_id: string
}

export interface AssetTypeDetails {
	id: string
	name: string
	assets?: AssetDetails[]
	quantity: number
}

export interface NewAssetTypeDetails {
	name: string
}
