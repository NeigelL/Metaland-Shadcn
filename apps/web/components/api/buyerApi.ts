import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export async function getBuyerLotsQueryApi() {
  try {
    const response = await axios.get('/api/buyer-lots');
    return response.data;
  } catch (error) {
    console.error('Error fetching buyer lots:', error);
    throw error;
  }
}

export function useBuyerLotsQuery() {
  return useQuery({
    queryKey: ['buyer-lots'],
    queryFn: getBuyerLotsQueryApi,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export async function getBuyerAmortizationsQueryApi() {
  try {
    const response = await axios.get('/api/buyer');
    return response.data;
  } catch (error) {
    console.error('Error fetching buyer lots:', error);
    throw error;
  }
}

export function useBuyerAmortizationsQuery() {
  return useQuery({
    queryKey: ['buyer-amortizations'],
    queryFn: getBuyerAmortizationsQueryApi,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export async function getBuyerAmortizationQueryApi(id:string) {
  try {
    const response = await axios.get('/api/amortizations/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching amortizations lots:', error);
    throw error;
  }
}

export function useBuyerAmortizationQuery(id:string) {
  return useQuery({
    queryKey: ['buyer-amortizations-'+id],
    queryFn: async() => await getBuyerAmortizationQueryApi(id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}