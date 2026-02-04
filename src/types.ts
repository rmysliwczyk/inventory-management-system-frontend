export interface User {
	username: string|undefined
	token: string
}

export interface AssetTypeDetails {
	id: string
	name: string
	assets?: AssetDetails[]
}

export interface AssetDetails {
	id: string
	description: string
	acquisition_date: string
}

export interface NewAssetTypeDetails {
	name: string
}
