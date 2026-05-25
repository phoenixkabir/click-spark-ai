import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, role } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const entry = {
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || '',
      role: role?.trim() || '',
      ts: new Date().toISOString(),
    }

    const filePath = path.join(process.cwd(), 'waitlist.jsonl')
    fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8')

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
