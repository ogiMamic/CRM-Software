import { NextResponse } from 'next/server';

export async function GET() {
  // Ovdje biste normalno dohvaćali podatke iz baze
  const contacts = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];
  return NextResponse.json(contacts);
}