
"use client"
import { ProspectStatus } from "@/types/prospect";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Eye, Mail, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { useState } from "react";
export default function CurrentProspect({
    prospects
}: {
    prospects: any[]
}) {
    const [showAllProspects, setShowAllProspects] = useState(false);
    const getStatusText = (status: string) =>{
        switch (status) {
            case 'in_queue' :
                return 'In Queue';
            case 'called' :
                return 'Called';
            case 'rejected' :
                return 'Rejected';
            case 'accepted' :
                return 'Accepted';
            default :
                return status;
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_queue' :
                return 'bg-pastel-yellow text-dark-yellow border-yellow';
            case 'called' :
                return 'bg-pastel-yellow text-dark-yellow border-yellow';
            case 'rejected' :
                return 'bg-pastel-red text-dark-red border-red';
            case 'accepted' :
                return 'bg-pastel-green text-dark-green border-green';
            default :
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return (
        <Card className="shadow-sm border-0 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                                {prospects.length} Total
                            </Badge>
                            {prospects.length > 3 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAllProspects(true)}
                                    className="text-xs h-7"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View All
                                </Button>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {prospects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm">No Leads yet. Add your first prospect above.</p>
                            </div>
                            ): (
                                prospects.slice(0, 3).map((prospect:any) => (
                                    <div 
                                     key={prospect.id}
                                     className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-sm text-gray-900 truncate">
                                                {`${prospect.first_name} ${prospect.middle_name} ${prospect.last_name}`.trim().replace(/\s+/g, ' ')}
                                            </h3>
                                                <Badge className= {`text-xs font-medium px-2 py-0.5 ${getStatusColor(prospect.status)}`}>
                                                    {getStatusText(prospect.status)}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                                    {prospect.type}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{prospect.email}</span>
                                                </div>
                                                {prospect.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3 flex-shrink-0"/>
                                                        <span>{prospect.phone}</span>
                                                    </div>
                                                )}
                                                {prospect.communicationPreference && (
                                                    <div className="flex items-center gap-1">
                                                        <MessageCircle className="w-3 h-3 flex-shrink-0"/>
                                                        <span className="capitalize truncate">
                                                            {prospect.communicationPreference === 'others'
                                                            ? prospect.otherCommunication
                                                            : prospect.communicationPreference}
                                                            {prospect.communicationAccount && `: ${prospect.communicationAccount}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {prospect.address && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{prospect.address}</span>
                                                    </div>
                                                )}
                                                {prospect.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs truncate">
                                                            {new Date(prospect.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                                {prospect.status === ProspectStatus.NEW && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs truncate">
                                                            {new Date(prospect.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
    );
}