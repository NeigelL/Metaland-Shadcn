import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getAgentAmortizationsQueryApi({
    start_date = new Date(),
    end_date = new Date(),
    group_by = 'summary',
}: {
    start_date?: Date;
    end_date?: Date;
    group_by?: 'month' | 'summary';
} = {}) {
    try {
        const response = await axios.post('/api/summary', {
            params: {
                start_date: start_date.toISOString(),
                end_date: end_date.toISOString(),
                group_by: group_by,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching agent summary', error);
        throw error;
    }
}

export function useAgentSummaryAmortizationsQuery({
    start_date = new Date(),
    end_date = new Date(),
    group_by = 'summary',
}: {
    start_date?: Date;
    end_date?: Date;
    group_by?: 'month' | 'summary';
} = {}) {
    // Format dates as "YYYY-MM-dd"
    const formatDate = (date: Date) =>
        date.toISOString().slice(0, 10);

    const formattedStartDate = formatDate(start_date);
    const formattedEndDate = formatDate(end_date);

    return useQuery({
        queryKey: ['agent-amortizations', formattedStartDate, formattedEndDate, group_by],
        queryFn: () =>
            getAgentAmortizationsQueryApi({
                start_date: new Date(formattedStartDate),
                end_date: new Date(formattedEndDate),
                group_by: group_by,
            }),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}



export async function getAgentEarliestQueryApi() {
    try {
        const response = await axios.get('/api/earliest');
        return response.data;
    } catch (error) {
        console.error('Error fetching agent earliest:', error);
        throw error;
    }
}

export function useAgentEarliestQuery() {
    return useQuery({
        queryKey: ['agent-earliest'],
        queryFn: () =>
            getAgentEarliestQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}


export async function getAgentDueDatesQueryApi() {
    try {
        const response = await axios.get('/api/due-dates');
        return response.data;
    } catch (error) {
        console.error('Error fetching agent due-dates', error);
        throw error;
    }
}

export function useAgentDueDatesQuery() {
    return useQuery({
        queryKey: ['agent-due-dates'],
        queryFn: () =>
            getAgentDueDatesQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export async function getAgentProjectsAvailableQueryApi() {
    try {
        const response = await axios.get('/api/projects-available');
        return response.data;
    } catch (error) {
        console.error('Error fetching agent projects available', error);
        throw error;
    }
}

export function useAgentProjectsAvailableQuery() {
    return useQuery({
        queryKey: ['agent-projects-available'],
        queryFn: () => getAgentProjectsAvailableQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export async function getAgentLeadsQueryApi() {
    try {
        const response = await axios.get('/api/prospects');
        return response.data;
    } catch (error) {
        console.error('Error fetching agent leads', error);
        throw error;
    }
}


export function useLeadsQuery() {
    return useQuery({
        queryKey: ['agent-leads'],
        queryFn: () => getAgentLeadsQueryApi(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export async function saveAgentLeadQueryApi(data: any) {
    try {
        const response = await axios.post('/api/prospects', {...data, action: "SAVE"});
        return response.data;
    } catch (error) {
        console.error('Error saving agent lead', error);
        throw error;
    }
}

export async function deleteAgentLeadQueryApi(buyer_prospect_id: any) {
    try {
        const response = await axios.post('/api/prospects', { action: "DELETE", leadId: buyer_prospect_id});
        return response.data;
    } catch (error) {
        console.error('Error deleting agent lead', error);
        throw error;
    }
}