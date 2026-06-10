import PDFDocument from "pdfkit";

export const pdfService = {
  generateReportPdf(data: any, professionalName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        doc
          .fontSize(20)
          .text("Fragile-X Screening Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString()}`);
        doc.text(`Solicitado por: ${professionalName}`);
        doc.moveDown();

        doc.fontSize(14).text("Filtros Aplicados:", { underline: true });
        doc.fontSize(10).text(JSON.stringify(data.filtros, null, 2));
        doc.moveDown();

        doc.fontSize(14).text("Resumo de Avaliações:", { underline: true });
        doc.fontSize(12).text(`Total: ${data.totais.total}`);
        doc.text(`Suspeitos (Alto Risco): ${data.totais.suspeito}`);
        doc.text(`Baixo Risco: ${data.totais.baixo_risco}`);
        doc.moveDown();

        doc.fontSize(14).text("Incidência de Sintomas:", { underline: true });
        data.incidenciaSintomas.forEach((s: any) => {
          doc.fontSize(10).text(`- ${s.nome}: ${s.ocorrencias} ocorrência(s)`);
        });

        const hash = Buffer.from(JSON.stringify(data.totais)).toString(
          "base64",
        );
        doc
          .fontSize(8)
          .text(`Traceability Hash: ${hash}`, 50, doc.page.height - 50, {
            align: "center",
          });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  },
};
