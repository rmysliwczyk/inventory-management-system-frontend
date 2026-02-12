import type { Dayjs } from 'dayjs'

interface DebugOptions {
	debugOptions?: {
		badEndpoint: boolean
		tooManyCharacters: boolean
	}
}

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

export interface NewAssetDetails extends DebugOptions {
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

export interface NewAssetTypeDetails extends DebugOptions{
	name: string
}
