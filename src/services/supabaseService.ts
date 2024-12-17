import { createClient } from '@supabase/supabase-js';
import { WifiMeasurement } from './wifiService';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export interface StoredMeasurement extends WifiMeasurement {
  id: string;
  client_id: string;
  location_name: string;
  created_at: string;
}

class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async storeMeasurement(measurement: WifiMeasurement, locationName: string, clientId: string): Promise<StoredMeasurement | null> {
    const { data, error } = await this.supabase
      .from('measurements')
      .insert([{
        signal_strength: measurement.signalStrength,
        speed: measurement.speed,
        latency: measurement.latency,
        location: measurement.location,
        timestamp: measurement.timestamp,
        location_name: locationName,
        client_id: clientId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error storing measurement:', error);
      return null;
    }

    return data;
  }

  async getMeasurementsByClient(clientId: string): Promise<StoredMeasurement[]> {
    const { data, error } = await this.supabase
      .from('measurements')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }

    return data || [];
  }
}

export default new SupabaseService();