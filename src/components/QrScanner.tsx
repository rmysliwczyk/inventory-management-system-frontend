import { Scanner } from '@yudiel/react-qr-scanner';
import type * as ReactQrScanner from '@yudiel/react-qr-scanner';

interface QrScannerProps {
	onScan: (detectedCodes: ReactQrScanner.IDetectedBarcode[]) => void,
	onError?: (error: unknown) => void
}

export function QrScanner({onScan, onError}: QrScannerProps) {
	if (onError) {
		return (
			<Scanner
				onScan={(result) => onScan(result)}
				onError={(error) => onError(error)}
			/>
		)
	} else {
		return (
			<Scanner
				onScan={(result) => onScan(result)}
			/>
		)
	}
}
