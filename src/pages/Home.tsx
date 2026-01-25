import customFetch from '../utils/customFetch'
import { useState, useEffect } from 'react'

export default function Home() {
	const [assetTypes, setAssetTypes] = useState()

	async function getAssetTypes() {
		console.log(await customFetch('/asset-types/'))
	}

	useEffect(() => {
		async function callAPI() {
			getAssetTypes()
		}

		callAPI()
	}, [])

	return <>Hello world!</>
}
