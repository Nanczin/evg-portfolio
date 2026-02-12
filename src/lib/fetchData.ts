import { supabase } from '@/lib/supabaseClient';
import contentData from '@/data/content.json';
import propertiesData from '@/data/properties.json';

export async function fetchContent() {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('data')
            .eq('key', 'main')
            .single();

        if (error || !data) {
            console.warn('Fetching content from local file (DB empty or error)');
            return contentData;
        }

        return data.data;
    } catch (error) {
        console.error('Failed to fetch content from Supabase:', error);
        return contentData;
    }
}

export async function fetchProperties() {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('data')
            .eq('key', 'properties')
            .single();

        if (error || !data) {
            console.warn('Fetching properties from local file (DB empty or error)');
            return propertiesData;
        }

        return data.data;
    } catch (error) {
        console.error('Failed to fetch properties from Supabase:', error);
        return propertiesData;
    }
}
