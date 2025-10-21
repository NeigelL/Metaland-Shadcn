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

export function useBuyerAmortizationMapQuery(id:string) {
  return useQuery({
    queryKey: ['buyer-amortizations-map-'+id],
    queryFn: async() => await getBuyerAmortizationMapQueryApi(id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export async function getBuyerAmortizationMapQueryApi(id:string) {
  try {
    const response = await axios.get('/api/amortization-map/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching amortizations maps:', error);
    throw error;
  }
}

export function useBuyerSimilarAmortizationQuery(id:string) {
  return useQuery({
    queryKey: ['buyer-amortizations-similar-'+id],
    queryFn: async() => await getBuyerSimilarAmortizationQueryApi(id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export async function getBuyerSimilarAmortizationQueryApi(id:string) {
  try {
    const response = await axios.get('/api/amortization-similar/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching getBuyerSimilarAmortizationQueryApi:', error);
    throw error;
  }
}