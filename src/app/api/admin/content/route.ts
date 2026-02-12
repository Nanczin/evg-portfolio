import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import contentData from '@/data/content.json';

// Fallback for local development or initial load if DB is empty
const defaultContent = contentData;

export async function GET() {
    try {
        // Tentar buscar do Supabase
        const { data, error } = await supabase
            .from('site_content')
            .select('data')
            .eq('key', 'main')
            .single();

        if (error || !data) {
            console.log('Fetching from local file (DB empty or error)');
            return NextResponse.json(defaultContent);
        }

        return NextResponse.json(data.data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(defaultContent);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Salvar no Supabase
        const { error } = await supabase
            .from('site_content')
            .upsert({
                key: 'main',
                data: body,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

        if (error) {
            console.error('Supabase save error:', error);
            throw error;
        }

        return NextResponse.json({ message: 'Content updated successfully in Database' });
    } catch (error) {
        console.error('Failed to update content:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
