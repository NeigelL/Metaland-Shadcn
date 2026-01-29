import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export async function getSalesManagerProjectsQueryApi() {
    try {
        const response = await axios.get('/api/projects');
        return response.data;
    } catch (error) {
        console.error('Error fetching sales manager projects available', error);
        throw error;
    }
}

export function useSalesManagerProjectsQuery() {
    return useQuery({
        queryKey: ['sales-manager-projects'],
        queryFn: () => getSalesManagerProjectsQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export async function getSalesManagerGoalsQueryApi() {
    try {
        const response = await axios.get('/api/goals');
        return response.data;
    } catch (error) {
        console.error('Error fetching sales manager goals available', error);
        throw error;
    }
}

export function useSalesManagerGoalsQuery() {
    return useQuery({
        queryKey: ['sales-manager-goals'],
        queryFn: () => getSalesManagerGoalsQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}