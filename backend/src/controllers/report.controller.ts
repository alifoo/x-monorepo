import type { Request, Response } from "express";
import { reportingService } from "../services/reporting.service.js";
import { pdfService } from "../services/pdf.service.js";
import { prisma } from "../config/prisma.js";
import type { ReportFilterParams } from "../types/report.schema.js";

export const reportController = {
  async getReport(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const filters = req.query as unknown as ReportFilterParams;

      const adminRole = await prisma.userRole.findFirst({
        where: { userId, role: { name: "administrator" }, status: "active" },
      });
      const isAdmin = !!adminRole;

      const reportData = await reportingService.aggregate(
        filters,
        userId,
        isAdmin,
      );

      if (req.path.endsWith(".pdf")) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const professionalName = isAdmin
          ? "Administrator"
          : user?.name || "Professional";

        const pdfBuffer = await pdfService.generateReportPdf(
          reportData,
          professionalName,
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="report.pdf"');
        return res.send(pdfBuffer);
      }

      return res.json(reportData);
    } catch (error: any) {
      console.error(error);

      if (error.message.includes("FORBIDDEN")) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: error.message },
        });
      }

      return res.status(500).json({
        error: { code: "INTERNAL", message: "Erro interno ao gerar relatório" },
      });
    }
  },
};
