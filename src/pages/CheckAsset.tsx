import { QrScanner } from '../components/QrScanner'
import useFetch from '../hooks/useFetch'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import type * as ReactQrScanner from '@yudiel/react-qr-scanner'
import { useState, useEffect } from 'react'
import type { AssetDetails } from '../types'


export default function CheckAsset() {
	const [showScanner, setShowScanner] = useState<boolean>(true)
	const [assetDetails, setAssetDetails] = useState<AssetDetails | {}>({})
	const [fetchUrl, setFetchUrl] = useState<string>('')
	const { data, error, loading } = useFetch<AssetDetails>(fetchUrl)

	useEffect(() => {
		if (data) {
			setAssetDetails({ id: data.id, description: data.description, "acquisition date": data.acquisition_date})
		}
	}, [data])

	function handleScan(result: ReactQrScanner.IDetectedBarcode[]) {
		setFetchUrl(`/assets/${result[0].rawValue}`)
		setShowScanner(false)
	}

	function resetScanner() {
		setShowScanner(true)
	}

	if (showScanner) {
		return (
			<>
				<Box
					component={Card}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '30px',
						padding: '20px',
						overflow: 'auto',
					}}
				>
					<Typography variant="h6">
						Please scan the asset tag
					</Typography>
					<Box>
						<QrScanner onScan={handleScan} />
					</Box>
				</Box>
			</>
		)
	} else {
		return (
			<>
				<Box
					component={Card}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						overflow: 'auto',
						maxWidth: '95%',
					}}
				>
					<Typography variant="h5">Asset details:</Typography>
					{loading ? (
						<Box
							sx={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<CircularProgress />
						</Box>
					) : error ? (
						<Alert severity="error">{error}</Alert>
					) : assetDetails ? (
						Object.entries(assetDetails).map(([key, value]) => (
							<Box
								key={key}
								sx={{
									display: 'flex',
									alignItems: 'center',
									flexWrap: 'wrap',
									gap: '10px',
									width: '100%',
								}}
							>
								<Typography variant="h6" sx={{ flexGrow: '1' }}>
									{key.toUpperCase()}
								</Typography>
								<Typography
									variant="body2"
									sx={{ flexGrow: '1' }}
								>
									{value}
								</Typography>
							</Box>
						))
					) : (
						''
					)}
					<Button onClick={resetScanner}>Scan another</Button>
				</Box>
			</>
		)
	}
}
