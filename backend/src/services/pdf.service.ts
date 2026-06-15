import PDFDocument from "pdfkit";
import type { ScreeningResult, Sex } from "../generated/prisma/index.js";
import type { ReportFilterParams } from "../types/report.schema.js";

type Doc = InstanceType<typeof PDFDocument>;

export type EvaluationPdfData = {
  sessionNumber: number;
  assessmentDate: Date;
  score: number | null;
  screeningResult: ScreeningResult | null;
  appliedThreshold: number | null;
  patient: { name: string; sex: Sex; birthDate: Date };
  symptoms: { name: string; isPresent: boolean }[];
};

export type ReportPdfData = {
  filtros: ReportFilterParams;
  totais: { suspeito: number; baixo_risco: number; total: number };
  porSexo: {
    m: { suspeito: number; baixo_risco: number };
    f: { suspeito: number; baixo_risco: number };
  };
  incidenciaSintomas: {
    sintomaId: string;
    nome: string;
    ocorrencias: number;
  }[];
  porPeriodo: { bucket: string; suspeito: number; baixo_risco: number }[];
};

const PALETTE = {
  ink: "#111827",
  muted: "#6B7280",
  rule: "#E5E7EB",
  band: "#1F2732",
  bandText: "#FFFFFF",
  bandSubtle: "#C7CDD6",
  accent: "#334155",
  suspected: "#1F2937",
  lowRisk: "#64748B",
  cardBg: "#F3F4F6",
} as const;

const HEADER_HEIGHT = 84;

function contentWidth(doc: Doc): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function fmtDate(value: Date): string {
  return value.toLocaleDateString("pt-BR");
}

function fmtDateTime(value: Date): string {
  return value.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function ageFromBirthDate(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return Math.max(age, 0);
}

function drawHeader(doc: Doc, title: string, subtitle: string): void {
  const left = doc.page.margins.left;
  doc.save();
  doc.rect(0, 0, doc.page.width, HEADER_HEIGHT).fill(PALETTE.band);
  doc
    .fillColor(PALETTE.bandText)
    .font("Helvetica-Bold")
    .fontSize(19)
    .text(title, left, 24, { width: contentWidth(doc) });
  doc
    .fillColor(PALETTE.bandSubtle)
    .font("Helvetica")
    .fontSize(11)
    .text(subtitle, left, 51);
  doc
    .fillColor(PALETTE.bandSubtle)
    .fontSize(8.5)
    .text(`Gerado em ${fmtDateTime(new Date())}`, left, 24, {
      width: contentWidth(doc),
      align: "right",
    });
  doc.restore();
  doc.fillColor(PALETTE.ink);
  doc.y = HEADER_HEIGHT + 24;
}

function sectionTitle(doc: Doc, text: string): void {
  const left = doc.page.margins.left;
  doc.moveDown(0.6);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(PALETTE.accent)
    .text(text.toUpperCase(), left, doc.y, { characterSpacing: 0.5 });
  const ruleY = doc.y + 3;
  doc
    .moveTo(left, ruleY)
    .lineTo(doc.page.width - doc.page.margins.right, ruleY)
    .lineWidth(1)
    .strokeColor(PALETTE.rule)
    .stroke();
  doc.y = ruleY + 8;
  doc.fillColor(PALETTE.ink).font("Helvetica").fontSize(11);
}

function row(doc: Doc, label: string, value: string): void {
  const left = doc.page.margins.left;
  const labelW = 160;
  const y = doc.y;
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(PALETTE.muted)
    .text(label, left, y, { width: labelW });
  const afterLabelY = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor(PALETTE.ink)
    .text(value, left + labelW, y, { width: contentWidth(doc) - labelW });
  doc.y = Math.max(afterLabelY, doc.y) + 3;
}

function resultBadge(doc: Doc, label: string, color: string): void {
  const left = doc.page.margins.left;
  doc.font("Helvetica-Bold").fontSize(13);
  const padX = 14;
  const padY = 7;
  const w = doc.widthOfString(label) + padX * 2;
  const h = doc.currentLineHeight() + padY * 2;
  const y = doc.y;
  doc.roundedRect(left, y, w, h, 5).fill(color);
  doc.fillColor(PALETTE.bandText).text(label, left + padX, y + padY, {
    lineBreak: false,
  });
  doc.y = y + h + 8;
  doc.fillColor(PALETTE.ink);
}

function statCards(
  doc: Doc,
  cards: { label: string; value: string; color: string }[],
): void {
  const left = doc.page.margins.left;
  const gap = 12;
  const w = (contentWidth(doc) - gap * (cards.length - 1)) / cards.length;
  const h = 60;
  const y = doc.y;
  cards.forEach((card, i) => {
    const x = left + i * (w + gap);
    doc.roundedRect(x, y, w, h, 6).fill(PALETTE.cardBg);
    doc
      .fillColor(card.color)
      .font("Helvetica-Bold")
      .fontSize(24)
      .text(card.value, x, y + 11, { width: w, align: "center" });
    doc
      .fillColor(PALETTE.muted)
      .font("Helvetica")
      .fontSize(9)
      .text(card.label.toUpperCase(), x, y + 42, {
        width: w,
        align: "center",
        characterSpacing: 0.5,
      });
  });
  doc.y = y + h + 10;
  doc.fillColor(PALETTE.ink);
}

function symptomLine(doc: Doc, name: string, present: boolean): void {
  const left = doc.page.margins.left;
  const box = 11;
  const y = doc.y;
  if (present) {
    doc.roundedRect(left, y + 1, box, box, 2).fill(PALETTE.accent);
    doc.save();
    doc
      .lineWidth(1.4)
      .strokeColor(PALETTE.bandText)
      .moveTo(left + 2.5, y + 6.5)
      .lineTo(left + 5, y + 9)
      .lineTo(left + 8.5, y + 3.5)
      .stroke();
    doc.restore();
  } else {
    doc
      .roundedRect(left, y + 1, box, box, 2)
      .lineWidth(1)
      .strokeColor(PALETTE.rule)
      .stroke();
  }
  doc
    .font(present ? "Helvetica-Bold" : "Helvetica")
    .fontSize(11)
    .fillColor(present ? PALETTE.ink : PALETTE.muted)
    .text(name, left + box + 8, y, { width: contentWidth(doc) - box - 8 });
  doc.y = Math.max(doc.y, y + box) + 5;
  doc.fillColor(PALETTE.ink);
}

function incidenceBars(
  doc: Doc,
  items: { nome: string; ocorrencias: number }[],
): void {
  const left = doc.page.margins.left;
  const total = contentWidth(doc);
  const labelW = 200;
  const countW = 30;
  const barMaxW = total - labelW - countW - 12;
  const max = Math.max(...items.map((i) => i.ocorrencias), 1);

  items.forEach((item) => {
    const y = doc.y;
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(PALETTE.ink)
      .text(item.nome, left, y, {
        width: labelW,
        ellipsis: true,
        lineBreak: false,
      });
    const barX = left + labelW;
    const barY = y + 1;
    const barH = 10;
    const w = Math.max((item.ocorrencias / max) * barMaxW, 2);
    doc.roundedRect(barX, barY, barMaxW, barH, 3).fill(PALETTE.cardBg);
    doc.roundedRect(barX, barY, w, barH, 3).fill(PALETTE.accent);
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(PALETTE.ink)
      .text(String(item.ocorrencias), barX + barMaxW + 6, y, {
        width: countW,
        align: "right",
        lineBreak: false,
      });
    doc.y = y + 16;
  });
  doc.fillColor(PALETTE.ink);
}

function drawFooters(doc: Doc): void {
  const range = doc.bufferedPageRange();
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const y = doc.page.height - 40;
    doc
      .moveTo(left, y)
      .lineTo(right, y)
      .lineWidth(0.5)
      .strokeColor(PALETTE.rule)
      .stroke();
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(PALETTE.muted)
      .text(
        "Documento gerado automaticamente pelo sistema Triagem X — uso clínico restrito.",
        left,
        y + 7,
        { width: right - left - 90, lineBreak: false },
      );
    doc.text(
      `Página ${i - range.start + 1} de ${range.count}`,
      right - 90,
      y + 7,
      { width: 90, align: "right", lineBreak: false },
    );
  }
}

function describeFilters(f: ReportFilterParams): [string, string][] {
  const rows: [string, string][] = [];
  if (f.sexo) {
    rows.push(["Sexo biológico", f.sexo === "m" ? "Masculino" : "Feminino"]);
  }
  if (f.idadeMin !== undefined || f.idadeMax !== undefined) {
    const min = f.idadeMin ?? 0;
    const max = f.idadeMax !== undefined ? `${f.idadeMax}` : "120+";
    rows.push(["Faixa etária", `${min} – ${max} anos`]);
  }
  if (f.resultado) {
    rows.push([
      "Resultado",
      f.resultado === "SUSPEITO" ? "Suspeito" : "Baixo risco",
    ]);
  }
  if (f.periodo) {
    const labels: Record<string, string> = {
      ultima_semana: "Última semana",
      ultimo_mes: "Último mês",
      ultimo_ano: "Último ano",
    };
    rows.push(["Período", labels[f.periodo] ?? f.periodo]);
  }
  if (f.dataInicio) {
    rows.push(["De", fmtDate(new Date(f.dataInicio))]);
  }
  if (f.dataFim) {
    rows.push(["Até", fmtDate(new Date(f.dataFim))]);
  }
  if (f.sintomas && f.sintomas.length > 0) {
    rows.push(["Sintomas filtrados", `${f.sintomas.length} selecionado(s)`]);
  }
  if (f.profissionalId) {
    rows.push(["Profissional", "Filtrado por profissional específico"]);
  }
  return rows;
}

export const pdfService = {
  generateReportPdf(
    data: ReportPdfData,
    professionalName: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        drawHeader(
          doc,
          "Relatório de Triagem Populacional",
          "Síndrome do X Frágil",
        );

        row(doc, "Solicitado por", professionalName);

        sectionTitle(doc, "Filtros aplicados");
        const filterRows = describeFilters(data.filtros);
        if (filterRows.length === 0) {
          doc
            .font("Helvetica-Oblique")
            .fontSize(10.5)
            .fillColor(PALETTE.muted)
            .text("Nenhum filtro aplicado — todas as avaliações.");
          doc.fillColor(PALETTE.ink);
        } else {
          filterRows.forEach(([label, value]) => row(doc, label, value));
        }

        sectionTitle(doc, "Resumo de avaliações");
        const { total, suspeito, baixo_risco } = data.totais;
        const pct = (n: number) =>
          total > 0 ? `${Math.round((n / total) * 100)}%` : "0%";
        statCards(doc, [
          { label: "Total", value: String(total), color: PALETTE.ink },
          {
            label: `Suspeitos · ${pct(suspeito)}`,
            value: String(suspeito),
            color: PALETTE.suspected,
          },
          {
            label: `Baixo risco · ${pct(baixo_risco)}`,
            value: String(baixo_risco),
            color: PALETTE.lowRisk,
          },
        ]);

        sectionTitle(doc, "Distribuição por sexo");
        row(
          doc,
          "Masculino",
          `${data.porSexo.m.suspeito} suspeito(s) · ${data.porSexo.m.baixo_risco} baixo risco`,
        );
        row(
          doc,
          "Feminino",
          `${data.porSexo.f.suspeito} suspeito(s) · ${data.porSexo.f.baixo_risco} baixo risco`,
        );

        sectionTitle(doc, "Incidência de sintomas");
        if (data.incidenciaSintomas.length === 0) {
          doc
            .font("Helvetica-Oblique")
            .fontSize(10.5)
            .fillColor(PALETTE.muted)
            .text("Nenhum sintoma registrado para os filtros selecionados.");
          doc.fillColor(PALETTE.ink);
        } else {
          incidenceBars(doc, data.incidenciaSintomas);
        }

        drawFooters(doc);
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  },

  generateEvaluationPdf(data: EvaluationPdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const suspected = data.screeningResult === "suspected";
        const lowRisk = data.screeningResult === "low_risk";
        const sexoLabel = data.patient.sex === "m" ? "Masculino" : "Feminino";

        drawHeader(
          doc,
          "Resultado da Avaliação",
          "Triagem — Síndrome do X Frágil",
        );

        sectionTitle(doc, "Paciente");
        row(doc, "Nome", data.patient.name);
        row(doc, "Sexo biológico", sexoLabel);
        row(
          doc,
          "Data de nascimento",
          `${fmtDate(data.patient.birthDate)} (${ageFromBirthDate(data.patient.birthDate)} anos)`,
        );
        row(doc, "Nº da sessão", String(data.sessionNumber));
        row(doc, "Data da avaliação", fmtDateTime(data.assessmentDate));

        sectionTitle(doc, "Resultado");
        if (suspected) {
          resultBadge(doc, "SUSPEITO DE X FRÁGIL", PALETTE.suspected);
        } else if (lowRisk) {
          resultBadge(doc, "BAIXO RISCO", PALETTE.lowRisk);
        } else {
          resultBadge(doc, "INDETERMINADO", PALETTE.muted);
        }
        row(doc, "Score obtido", data.score != null ? String(data.score) : "—");
        row(
          doc,
          "Limiar aplicado",
          data.appliedThreshold != null ? String(data.appliedThreshold) : "—",
        );
        if (suspected) {
          doc.moveDown(0.4);
          doc
            .font("Helvetica-Oblique")
            .fontSize(10.5)
            .fillColor(PALETTE.suspected)
            .text(
              "Recomenda-se encaminhamento para exame molecular de confirmação diagnóstica.",
              doc.page.margins.left,
              doc.y,
              { width: contentWidth(doc) },
            );
          doc.fillColor(PALETTE.ink);
        }

        sectionTitle(doc, "Sintomas avaliados");
        data.symptoms.forEach((s) => symptomLine(doc, s.name, s.isPresent));

        drawFooters(doc);
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  },
};
