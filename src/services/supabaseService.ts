import { supabase } from '@/integrations/supabase/client';
import { WifiMeasurement, StoredMeasurement } from '@/types/wifi';
import { Database } from '@/integrations/supabase/types';

interface ClientInfo {
  documentType: string;
  documentNumber: string;
  phone: string;
  subscriberNumber: string;
  orderNumber: string;
  serviceType: string;
}

class SupabaseService {
  async storeMeasurement(
    measurement: WifiMeasurement,
    locationName: string,
    clientId: string,
    clientInfo: ClientInfo
  ): Promise<StoredMeasurement | null> {
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
          client_id: clientId,
          client_document_type: clientInfo.documentType,
          client_document_number: clientInfo.documentNumber,
          client_phone: clientInfo.phone,
          subscriber_number: clientInfo.subscriberNumber,
          order_number: clientInfo.orderNumber,
          service_type: clientInfo.serviceType
        }])
        .select()
        .single();

      if (error) {
        console.error('Error storing measurement:', error);
        return null;
      }

      return {
        id: data.id,
        signal_strength: data.signal_strength,
        speed: data.speed,
        latency: data.latency,
        location: data.location as { x: number; y: number; z: number },
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

      return (data || []).map(record => ({
        id: record.id,
        signal_strength: record.signal_strength,
        speed: record.speed,
        latency: record.latency,
        location: record.location as { x: number; y: number; z: number },
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