import { Scanner } from '@yudiel/react-qr-scanner';
import type * as ReactQrScanner from '@yudiel/react-qr-scanner';

interface QrScannerProps {
	onScan: (detectedCodes: ReactQrScanner.IDetectedBarcode[]) => void,
	onError?: (error: unknown) => void
	paused?: boolean
}

export function QrScanner({onScan, onError, paused}: QrScannerProps) {
	if (onError) {
		return (
			<Scanner
				onScan={(result) => onScan(result)}
				onError={(error) => onError(error)}
				paused={paused}
			/>
		)
	} else {
		return (
			<Scanner
				onScan={(result) => onScan(result)}
				paused={paused}
			/>
		)
	}
}
