import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import propertiesData from '@/data/properties.json';

// Fallback for local development or initial load if DB is empty
const defaultProperties = propertiesData;

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('data')
            .eq('key', 'properties')
            .single();

        if (error || !data) {
            console.log('Fetching properties from local file (DB empty or error)');
            return NextResponse.json(defaultProperties);
        }

        return NextResponse.json(data.data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(defaultProperties);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { error } = await supabase
            .from('site_content')
            .upsert({
                key: 'properties',
                data: body,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

        if (error) {
            console.error('Supabase properties save error:', error);
            throw error;
        }

        return NextResponse.json({ message: 'Properties updated successfully in Database' });
    } catch (error) {
        console.error('Failed to update properties', error);
        return NextResponse.json({ error: 'Failed to update properties' }, { status: 500 });
    }
}
