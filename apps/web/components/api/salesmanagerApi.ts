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