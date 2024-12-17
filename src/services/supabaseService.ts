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

      // Map the response back to our interface format and ensure location type
      return {
        id: data.id,
        signalStrength: data.signal_strength,
        speed: data.speed,
        latency: data.latency,
        location: {
          x: (data.location as any).x || 0,
          y: (data.location as any).y || 0,
          z: (data.location as any).z || 0
        },
        timestamp: data.timestamp,
        client_id: data.client_id,
        location_name: data.location_name,
        created_at: data.created_at
      };
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

      // Map each database record to our interface format and ensure location type
      return (data || []).map(record => ({
        id: record.id,
        signalStrength: record.signal_strength,
        speed: record.speed,
        latency: record.latency,
        location: {
          x: (record.location as any).x || 0,
          y: (record.location as any).y || 0,
          z: (record.location as any).z || 0
        },
        timestamp: record.timestamp,
        client_id: record.client_id,
        location_name: record.location_name,
        created_at: record.created_at
      }));
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
      return [];
    }
  }
}

export default new SupabaseService();