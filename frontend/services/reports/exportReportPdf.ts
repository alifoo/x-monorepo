import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { fetchReportPdfBuffer } from './exportReportPdf.shared';
import type { ReportFilters } from './types';

async function sharePdfOnNative(fileUri: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Compartilhamento não disponível neste dispositivo.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Exportar relatório',
  });
}

async function savePdfOnNative(buffer: ArrayBuffer): Promise<void> {
  const file = new File(Paths.document, `relatorio-${Date.now()}.pdf`);
  // Synchronous write — avoids file.writableStream(), which relies on a global
  // WritableStream that does not exist in the iOS/Hermes runtime.
  file.create({ overwrite: true });
  file.write(new Uint8Array(buffer));

  await sharePdfOnNative(file.uri);
}

export async function exportReportPdf(filters: ReportFilters): Promise<void> {
  const buffer = await fetchReportPdfBuffer(filters);
  await savePdfOnNative(buffer);
}
