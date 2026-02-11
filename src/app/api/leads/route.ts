import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const leadsFilePath = path.join(process.cwd(), 'src', 'data', 'leads.json');

// Helper para garantir que o arquivo existe
const ensureLeadsFile = () => {
    if (!fs.existsSync(leadsFilePath)) {
        // Criar diretório se não existir
        const dir = path.dirname(leadsFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Criar arquivo vazio
        fs.writeFileSync(leadsFilePath, '[]', 'utf8');
        return [];
    }
    const content = fs.readFileSync(leadsFilePath, 'utf8');
    try {
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
};

export async function GET() {
    try {
        const leads = ensureLeadsFile();
        // Ordenar do mais novo para o mais antigo por padrão
        // @ts-ignore
        leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const leads = ensureLeadsFile();

        const newLead = {
            id: Date.now(), // Timestamp como ID simples
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
            date: new Date().toISOString(),
            status: 'new' // new, contacted, closed
        };

        leads.push(newLead);

        fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2), 'utf8');

        return NextResponse.json({ message: 'Lead saved successfully', lead: newLead });
    } catch (error) {
        console.error('Error saving lead:', error);
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }
}
