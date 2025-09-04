"use client"

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

interface Prospect {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    communicationPreference?: string;
    communicationAccount?: string;
    otherCommunication?: string;
    status: 'in_queue' | 'called'| 'rejected' | 'accepted';
    type: 'local' | 'international';
    createdAt: Date;
    autoRejected?: boolean;
}

interface AllProspectsPageProps {
    prospects: Prospect[];
    onBack: () => void;
}

type TabType = 'all' | 'in_queue' | 'accepted' | 'rejected'

const AllProspectsPage = ({ prospects, onBack }: AllProspectsPageProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const getStatusColor = (status: Prospect['status'], autoRejected?: boolean) => {
        switch (status) {
            case 'in_queue' :
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'called' :
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected' :
                return autoRejected 
                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                    : 'bg-red-100 text-red-800 border-red-200';
            case 'accepted' :
                return 'bg-green-100 text-green-800 border-green-200';
            default :
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: Prospect['status'], autoRejected?: boolean) => {
        switch (status) {
            case 'in_queue' : return 'Queue';
            case 'called' : return 'Called';
            case 'rejected' : return autoRejected ? 'Auto' : 'Rejected';
            case 'accepted' : return 'Accepted';
            default : return status;
        }
    };

    const filterProspects = (prospects: Prospect[], tab: TabType) => {
        switch (tab) {
            case 'all':
                return prospects;
            case 'in_queue':
                return prospects.filter(p => p.status === 'in_queue');
            case 'accepted':
                return prospects.filter(p => p.status === 'accepted');
            case 'rejected':
                return prospects.filter(p => p.status === 'rejected');
            default:
                return prospects;
        }
    };

    const filteredProspects = filterProspects(prospects, activeTab);

    const getTabCount = (tab: TabType) => {
        return filterProspects(prospects, tab).length;
    };

    const tabs: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'in_queue', label: 'In Queue' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'rejected', label: 'Rejected' }
    ];

    return (
        <div className="w-full mx-auto p-2 sm:p-6">
            <div className="mb-6 space-y-6">
                {/* Responsive Header */}
                <div className="flex items-center justify-between mb-3 bg-white p-2 sm:p-3 rounded-lg border">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="h-6 sm:h-7 px-1 sm:px-2 text-xs"
                        >
                            ← Back
                        </Button>
                        <h1 className="text-base sm:text-md font-bold text-gray-900">YOUR PROSPECTS</h1>
                    </div>
                    <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-1">
                        {prospects.length}
                    </Badge>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 mb-0">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-gray-100">
                                    {getTabCount(tab.key)}
                                </Badge>
                            </button>
                        ))}
                    </div>

                    {/* List Content */}
                    {filteredProspects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Mail className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs">No prospects in this category</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredProspects.map((prospect, index) => (
                                <div 
                                    key={prospect.id}
                                    className="p-2.5 hover:bg-gray-50 transition-colors text-xs"
                                >
                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        {/* Number */}
                                        <span className="text-gray-400 font-mono w-5 text-center flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        
                                        {/* Name - Made Wider */}
                                        <div className="font-medium text-gray-900 min-w-0 flex-shrink-0 w-48">
                                            <span className="truncate block">
                                                {`${prospect.first_name} ${prospect.middle_name || ''} ${prospect.last_name}`.trim().replace(/\s+/g, ' ')}
                                            </span>
                                        </div>
                                        
                                        {/* Status */}
                                        <Badge className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${getStatusColor(prospect.status, prospect.autoRejected)}`}>
                                            {getStatusText(prospect.status, prospect.autoRejected)}
                                        </Badge>
                                        
                                        {/* Type */}
                                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                                            {prospect.type === 'local' ? 'L' : 'I'}
                                        </Badge>
                                        
                                        {/* Email */}
                                        <div className="flex items-center gap-1 min-w-0 flex-1">
                                            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{prospect.email}</span>
                                        </div>
                                        
                                        {/* Phone/Communication */}
                                        <div className="flex items-center gap-1 min-w-0 w-28 flex-shrink-0">
                                            {prospect.phone ? (
                                                <>
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    <span className="truncate">{prospect.phone}</span>
                                                </>
                                            ) : prospect.communicationPreference ? (
                                                <>
                                                    <MessageCircle className="w-3 h-3 text-gray-400" />
                                                    <span className="truncate">
                                                        {prospect.communicationPreference === 'others'
                                                        ? prospect.otherCommunication
                                                        : prospect.communicationPreference}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </div>
                                        
                                        {/* Date */}
                                        <div className="text-gray-400 w-12 text-right flex-shrink-0">
                                            {prospect.createdAt.toLocaleDateString('en-US', { 
                                                month: 'numeric', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                    </div>

                                    {/* Mobile Layout */}
                                    <div className="sm:hidden">
                                        {/* First row: Number, Name, Status, Date */}
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <span className="text-gray-400 font-mono text-xs flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <h3 className="font-medium text-sm text-gray-900 truncate">
                                                    {`${prospect.first_name} ${prospect.last_name}`}
                                                </h3>
                                                <Badge className={`text-xs px-1 py-0.5 flex-shrink-0 ${getStatusColor(prospect.status, prospect.autoRejected)}`}>
                                                    {getStatusText(prospect.status, prospect.autoRejected)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <Badge variant="outline" className="text-xs px-1 py-0.5">
                                                    {prospect.type === 'local' ? 'L' : 'I'}
                                                </Badge>
                                                <span className="text-gray-400 text-xs">
                                                    {prospect.createdAt.toLocaleDateString('en-US', { 
                                                        month: 'numeric', 
                                                        day: 'numeric' 
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Second row: Contact info */}
                                        <div className="space-y-1 ml-4">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                <span className="truncate text-xs text-gray-600">{prospect.email}</span>
                                            </div>
                                            
                                            {prospect.phone && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-xs text-gray-600">{prospect.phone}</span>
                                                </div>
                                            )}
                                            
                                            {prospect.communicationPreference && (
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate text-xs text-gray-600">
                                                        {prospect.communicationPreference === 'others'
                                                        ? prospect.otherCommunication
                                                        : prospect.communicationPreference}
                                                        {prospect.communicationAccount && `: ${prospect.communicationAccount}`}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {prospect.address && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate text-xs text-gray-600">{prospect.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop: Address on separate line if it exists */}
                                    {prospect.address && (
                                        <div className="hidden sm:flex items-center gap-1 ml-7 mt-1 text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate text-xs">{prospect.address}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProspectsPage;