import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  // Implementirajte logiku za dohvaćanje kontakata
}