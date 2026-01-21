
import { Metadata } from 'next';
import PageClient from './PageClient';

export const metadata: Metadata = {
    title: 'Project Updates | Agent Portal',
    description: 'View real-time project updates and lot availability',
};

export default function Page() {
    return <PageClient />;
}
