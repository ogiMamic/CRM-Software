import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.inventoryReport.groupBy({
      by: ['date'],
      _sum: {
        consumtion: true,
        availability: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const formattedReports = reports.map((report) => {
      const month = new Date(report.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      return {
        month,
        consumtion: report._sum.consumtion,
        availability: report._sum.availability,
      };
    });

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error("Error fetching inventory reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
