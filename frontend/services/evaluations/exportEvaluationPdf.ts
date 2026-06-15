import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { fetchEvaluationPdfBuffer } from './exportEvaluationPdf.shared';

async function sharePdfOnNative(fileUri: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Compartilhamento não disponível neste dispositivo.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Exportar avaliação',
  });
}

export async function exportEvaluationPdf(evaluationId: string): Promise<void> {
  const buffer = await fetchEvaluationPdfBuffer(evaluationId);
  const file = new File(Paths.document, `avaliacao-${evaluationId}.pdf`);
  // Synchronous write — avoids file.writableStream(), which relies on a global
  // WritableStream that does not exist in the iOS/Hermes runtime.
  file.create({ overwrite: true });
  file.write(new Uint8Array(buffer));

  await sharePdfOnNative(file.uri);
}
