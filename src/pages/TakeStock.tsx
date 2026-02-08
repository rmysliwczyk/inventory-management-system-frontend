import { useParams } from 'react-router'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { QrScanner } from '../components/QrScanner'
import type * as ReactQrScanner from '@yudiel/react-qr-scanner'
import { useContext, useEffect, useState } from 'react'
import type { AssetTypeDetails, AssetDetails } from '../types'
import useFetch from '../hooks/useFetch'
import {isMobile} from 'react-device-detect'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

export default function TakeStock() {
	const { assetTypeId } = useParams()
	const [takingStockFinished, setTakingStockFinished] = useState<boolean>(false)
	const [scannedAssets, setScannedAssets] = useState<AssetDetails[]>([])
	const [assetsLeftToScan, setAssetsLeftToScan] = useState<AssetDetails[]>([])
	const [assetTypeDetails, setAssetTypeDetails] = useState<AssetTypeDetails>()
	const [assetDetails, setAssetDetails] = useState<AssetDetails>()
	const [fetchAssetUrl, setFetchAssetUrl] = useState<string>('')
	const {data: assetTypeData, error: assetTypeError, loading: assetTypeLoading} = useFetch<AssetTypeDetails>(`/asset-types/${assetTypeId}`)
	const {data: assetData, error: assetError, loading: assetLoading} = useFetch<AssetDetails>(fetchAssetUrl)


	useEffect(() => {
		if (assetTypeData) {
			setAssetTypeDetails(assetTypeData)
			if (assetTypeData.assets) {
				setAssetsLeftToScan(assetTypeData.assets)
			}
		}
	}, [assetTypeData])

	useEffect(() => {
			if(assetTypeDetails && assetTypeDetails.quantity > 0) {
				if(scannedAssets.length == assetTypeDetails.quantity) {
					setTakingStockFinished(true)
				}
			}
	},[scannedAssets, assetsLeftToScan])

	function handleScan(result: ReactQrScanner.IDetectedBarcode[]) {
		let scannedAsset = assetsLeftToScan.find((asset) => (asset.id == result[0].rawValue))
		if(scannedAsset) {
			setScannedAssets((prev) => [...prev, scannedAsset])
		}
		setAssetsLeftToScan((prev) => (prev.filter((asset) => asset.id != result[0].rawValue)))
	}

	return (
		<>
			<Box
				component={Card}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '15px',
					padding: '20px',
					overflow: 'auto',
					width: '95%',
					minHeight: '70vh',
				}}
			>
			{
				!isMobile ? <Alert severity="info">This page is only available on a mobile device</Alert> :
				assetTypeError ? <Alert severity="error">{assetTypeError}</Alert> :
				assetTypeDetails?.quantity == 0 ? <Alert severity="error">This asset type has no assets. Add some first</Alert> :
				takingStockFinished ?
				<>
				<Typography variant="h6">
					Finished taking stock of asset:
				</Typography>
				<Typography variant="h4">
					{assetTypeDetails ? assetTypeDetails?.name : "Loading..."}
				</Typography>
				<Typography variant="subtitle2">
					Scanned {scannedAssets.length} out of {assetTypeDetails ? assetTypeDetails.quantity : "Loading..."} total assets
				</Typography>
				<Typography variant="h5" color="success">
					<DoneOutlineIcon/> All assets accounted for
				</Typography>
				</>
				:
				<>
				<Typography variant="h6">
					Taking stock of asset type:
				</Typography>
				<Typography variant="h4">
					{assetTypeDetails ? assetTypeDetails?.name : "Loading..."}
				</Typography>
				<Typography variant="subtitle2">
					Scanned {scannedAssets.length} out of {assetTypeDetails ? assetTypeDetails.quantity : "Loading..."} total assets
				</Typography>
				<Box>
					{ assetTypeDetails ?
						<QrScanner onScan={handleScan} />
						:
						<CircularProgress />
					}
				</Box>
				</>
			}
			</Box>
		</>
	)
}
