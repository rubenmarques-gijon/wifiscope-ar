import { supabase } from '@/integrations/supabase/client';
import { WifiMeasurement } from './wifiService';
import { Database } from '@/integrations/supabase/types';

export interface StoredMeasurement extends WifiMeasurement {
  id: string;
  client_id: string;
  location_name: string;
  created_at: string;
}

class SupabaseService {
  async storeMeasurement(measurement: WifiMeasurement, locationName: string, clientId: string): Promise<StoredMeasurement | null> {
    try {
      const { data, error } = await supabase
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
    } catch (error) {
      console.error('Failed to store measurement:', error);
      return null;
    }
  }

  async getMeasurementsByClient(clientId: string): Promise<StoredMeasurement[]> {
    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching measurements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
      return [];
    }
  }
}

export default new SupabaseService();