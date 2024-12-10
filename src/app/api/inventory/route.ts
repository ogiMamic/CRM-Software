import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      include: {
        reports: true,
      },
    });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, quantity, status } = body;

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        type,
        quantity,
        status,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, type, quantity, status } = body;

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name,
        type,
        quantity,
        status,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing inventory item ID" }, { status: 400 });
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 });
  }
}
