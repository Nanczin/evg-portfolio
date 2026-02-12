import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('leads') // Tabela 'leads' no Supabase
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Inserir no Supabase
        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    message: body.message,
                    status: 'new'
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        return NextResponse.json({ message: 'Lead saved successfully', lead: data ? data[0] : null });
    } catch (error) {
        console.error('Error saving lead to Supabase:', error);
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }
}
