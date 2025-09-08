"use client"

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Loader2, Mail, MapPin, MessageCircle, Phone, Plus, Eye, DownloadIcon, UploadIcon} from "lucide-react";
import { useState } from "react";
import AllProspectsPage from "@/components/ProspectAllView";
// import Papa from 'papaparse';
import { saveAgentLeadQueryApi, useLeadsQuery } from "@/components/api/agentApi";
import CurrentProspect from "@/components/Prospects/CurrentProspect";

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

interface FormData{
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone_prefix: string,
    phone: string;
    land_line:string,
    address: string;
    communicationPreference: string;
    communicationAccount: string;
    otherCommunication: string;
    remarks: string
}


const ProspectPage = ()=> {
    const {data: prospects = [], refetch } = useLeadsQuery()

    const [isLocal, setIsLocal] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone_prefix: "+63",
        phone: '',
        land_line: '',
        address: '',
        communicationPreference: '',
        communicationAccount: '',
        otherCommunication: '',
        remarks:''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showAllProspects, setShowAllProspects] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string} | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    if (showAllProspects) {
        return <AllProspectsPage prospects={prospects} onBack={() => setShowAllProspects(false)} />;
    }

    const getStatusColor = (status: Prospect['status']) => {
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

    const getStatusText = (status: Prospect['status']) =>{
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

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (message) setMessage(null);
    }

    const checkExistingProspect = async(data: FormData) : Promise<boolean> => {
        const fullName = `${data.first_name} ${data.middle_name} ${data.last_name}`.trim().replace(/\s+/g, '');

        return prospects.some((prospect:any) =>{
            const prospectFullName =   `${prospect.first_name} ${prospect.middle_name} ${prospect.last_name}`.trim().replace(/\s+/g, '');
            return prospectFullName.toLowerCase() === fullName.toLowerCase() ||
                   prospect.email.toLowerCase() === data.email.toLowerCase() ||
                   (data.phone && prospect.phone === data.phone);
     });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setShowOverlay(true);
        setMessage(null);

        const exists = await saveAgentLeadQueryApi(formData);

        try {
            if (exists?.error) {
                setMessage({
                    type: 'error',
                    text: 'Error: This person already exists.'
                });

                // const autoRejectedProspect: Prospect = {
                //     id: Date.now().toString(),
                //     first_name: formData.first_name,
                //     middle_name: formData.middle_name,
                //     last_name: formData.last_name,
                //     email: formData.email,
                //     phone: isLocal? formData.phone : undefined,
                //     address: formData.address || undefined,
                //     communicationPreference: !isLocal ? formData.communicationPreference: undefined,
                //     communicationAccount: !isLocal ? formData.communicationAccount : undefined,
                //     otherCommunication: !isLocal && formData.communicationPreference === 'others' ? formData.otherCommunication : undefined,
                //     status: 'rejected',
                //     type: isLocal ? 'local' : 'international',
                //     createdAt: new Date(),
                //     autoRejected: true
                // };

                // setProspects(prev => [autoRejectedProspect, ...prev]);
                refetch();
            } else {
                // const newProspect: Prospect = {
                //     id: Date.now().toString(),
                //     first_name: formData.first_name,
                //     middle_name: formData.middle_name,
                //     last_name: formData.last_name,
                //     email: formData.email,
                //     phone: isLocal? formData.phone : undefined,
                //     address: formData.address || undefined,
                //     communicationPreference: !isLocal ? formData.communicationPreference: undefined,
                //     communicationAccount: !isLocal ? formData.communicationAccount : undefined,
                //     otherCommunication: !isLocal && formData.communicationPreference === 'others' ? formData.otherCommunication : undefined,
                //     status: 'in_queue',
                //     type: isLocal ? 'local' : 'international',
                //     createdAt: new Date()
                // };

                // setProspects(prev => [...prev, ...]);
                refetch();
                setMessage({
                    type: 'success',
                    text: 'Lead successfully added.'
                });

                setFormData({
                    first_name:'',
                    middle_name:'',
                    last_name: '',
                    email: '',
                    phone_prefix: '+63',
                    phone: '',
                    land_line: '',
                    address: '',
                    communicationPreference: '',
                    communicationAccount: '',
                    otherCommunication: '',
                    remarks:''
                });
            }
        } catch {
            setMessage({
                type: 'error',
                text: 'An error occurred while processing your request.'
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowOverlay(false), 2000);
        }
    };

    const isFormValid = formData.first_name && formData.email &&
    (isLocal ? formData.phone :
        (formData.communicationPreference && formData.communicationAccount&&
            (formData.communicationPreference !== 'others' || formData.otherCommunication)
        )
    );

    const generateCSVTemplate = () => {
        const headers = [
            'first_name',
            'middle_name',
            'last_name',
            'email',
            'phone',
            'address',
            'communicationPreference',
            'communicationAccount',
            'otherCommunication',
            'type'
        ];
        
     const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prospects_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const handleCSVImport = async (file: File) => {
    setIsImporting(true);
    setIsLoading(true);
    setShowOverlay(true);
    setMessage(null);
    
    try {
        const text = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
        
        const results:any = {}
        // Papa.parse(text, {
        //     header: true,
        //     skipEmptyLines: true,
        //     dynamicTyping: false,
        //     transformHeader: (header: string) => header.trim()
        // });
        
        if (results.errors.length > 0) {
            setMessage({
                type: 'error',
                text: 'Error parsing CSV file. Please check the format.'
            });
            return;
        }
        
        let successCount = 0;
        let duplicateCount = 0;
        
        const newProspects: Prospect[] = [];
        
        (results.data as Record<string, string>[]).forEach((row) => {
            // Skip rows with missing required fields
            if (!row.first_name || !row.email) return;
            
            const prospectData: FormData = {
                first_name: row.first_name?.trim() || '',
                middle_name: row.middle_name?.trim() || '',
                last_name: row.last_name?.trim() || '',
                email: row.email?.trim() || '',
                phone_prefix: row.phone_prefix?.trim() || '',
                land_line: row.land_line?.trim() || '',
                phone: row.phone?.trim() || '',
                address: row.address?.trim() || '',
                communicationPreference: row.communicationPreference?.trim() || '',
                communicationAccount: row.communicationAccount?.trim() || '',
                otherCommunication: row.otherCommunication?.trim() || '',
                remarks: row.remarks?.trim() || ''
            };
            
            // Debug type detection
            const isLocalType = row.type?.toLowerCase()?.trim() !== 'international';
            console.log('Raw type value:', `"${row.type}"`, 'isLocalType:', isLocalType);
            
            // Check against existing prospects and current batch
            const fullName = `${prospectData.first_name} ${prospectData.middle_name} ${prospectData.last_name}`.trim().replace(/\s+/g, '');
            const allExistingProspects = [...prospects, ...newProspects];
            
            const exists = allExistingProspects.some(prospect =>{
                const prospectFullName = `${prospect.first_name} ${prospect.middle_name || ''} ${prospect.last_name}`.trim().replace(/\s+/g, '');
                return prospectFullName.toLowerCase() === fullName.toLowerCase() ||
                       prospect.email.toLowerCase() === prospectData.email.toLowerCase() ||
                       (prospectData.phone && prospect.phone === prospectData.phone);
            });
            
            if (exists) {
                duplicateCount++;
                // Add auto-rejected duplicate
                const autoRejectedProspect: Prospect = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    first_name: prospectData.first_name,
                    middle_name: prospectData.middle_name,
                    last_name: prospectData.last_name,
                    email: prospectData.email,
                    phone: isLocalType ? prospectData.phone : undefined,
                    address: prospectData.address || undefined,
                    communicationPreference: !isLocalType ? prospectData.communicationPreference : undefined,
                    communicationAccount: !isLocalType ? prospectData.communicationAccount : undefined,
                    otherCommunication: !isLocalType && prospectData.communicationPreference === 'others' ? prospectData.otherCommunication : undefined,
                    status: 'rejected',
                    type: isLocalType ? 'local' : 'international',
                    createdAt: new Date(),
                    autoRejected: true
                };
                newProspects.push(autoRejectedProspect);
            } else {
                successCount++;
                const newProspect: Prospect = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    first_name: prospectData.first_name,
                    middle_name: prospectData.middle_name,
                    last_name: prospectData.last_name,
                    email: prospectData.email,
                    phone: isLocalType ? prospectData.phone : undefined,
                    address: prospectData.address || undefined,
                    communicationPreference: !isLocalType ? prospectData.communicationPreference : undefined,
                    communicationAccount: !isLocalType ? prospectData.communicationAccount : undefined,
                    otherCommunication: !isLocalType && prospectData.communicationPreference === 'others' ? prospectData.otherCommunication : undefined,
                    status: 'in_queue',
                    type: isLocalType ? 'local' : 'international',
                    createdAt: new Date()
                };
                newProspects.push(newProspect);
            }
        });
        
        // setProspects(prev => [...newProspects, ...prev]);
        
        const messageText = successCount > 0 && duplicateCount > 0
            ? `${successCount} leads added successfully. ${duplicateCount} duplicates rejected.`
            : successCount > 0 
            ? `${successCount} leads added successfully.`
            : 'No valid leads found in CSV file.';
            
        setMessage({
            type: successCount > 0 ? 'success' : 'error',
            text: messageText
        });
        
    } catch{
        setMessage({
            type: 'error',
            text: 'Error processing CSV file.'
        });
    } finally {
        setIsImporting(false);
        setIsLoading(false);
        setTimeout(() => setShowOverlay(false), 2000);
    }
};

const triggerCSVImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            handleCSVImport(file);
        }
    };
    input.click();
};
    

    return (
        <div className="w-full mx-auto p-2 sm:p-6">
            <div className="mb-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            PROSPECTS
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {/* <Button
                        onClick={generateCSVTemplate}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Download CSV Template
                    </Button>
                    
                    <Button
                        onClick={triggerCSVImport}
                        disabled={isImporting || isLoading}
                        size="sm"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                    >
                        <UploadIcon className="w-4 h-4" />
                        {isImporting ? 'Importing...' : 'Import CSV'}
                    </Button> */}
                </div>

                <Card className="shadow-sm border-0 bg-white relative">
                    <CardContent>
                    <form
                        onSubmit={handleSubmit}
                    >
                    {showOverlay && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                            <div className="text-center">
                                {isLoading ? (
                                    <div className="flex flex-col items-center space-y-3">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                                        <p className="text-sm text-gray-700">Checking records...</p>
                                    </div>
                                ) : message ? (
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                        }`}>
                                            <span className={`text-sm font-medium ${
                                                message.type === 'success' ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                                {message.type === 'success' ? '✓' : 'X'}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                                {message.type === 'success' ? 'Success' : 'Error'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {message.text}
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                                        First Name *
                                    </Label>
                                    <Input
                                    id="first_name"
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    placeholder="Enter Lead's First Name"
                                    className="h-8 truncate"
                                    autoComplete="off"
                                    required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="middle_name" className="text-sm font-medium text-gray-700">
                                        Middle Name  <span className="text-gray-400">(Optional)</span>
                                    </Label>
                                    <Input
                                    id="middle_name"
                                    type="text"
                                    value={formData.middle_name}
                                    onChange={(e) => handleInputChange('middle_name', e.target.value)}
                                    placeholder="Enter Lead's Middle Name"
                                    className="h-8 truncate"
                                    autoComplete="off"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                                       Last Name
                                    </Label>
                                    <Input
                                    id="last_name"
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    placeholder="Enter Lead's Last Name"
                                    className="h-8 truncate"
                                    autoComplete="off"
                                    required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email *
                                    </Label>
                                    <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter Email Address"
                                    className="h-8 truncate"
                                    autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 py-1 mb-4">
                                <Label htmlFor = "prospect-type" className= {`text-sm ${isLocal ? 'text-blue' : 'text-gray-500'}`} >
                                    Local
                                </Label>
                                <Switch
                                id="prospect-type"
                                checked={!isLocal}
                                onCheckedChange={(checked) => {
                                    setIsLocal(!checked)
                                    setFormData(prev => ({ ...prev, phone: '', communicationPreference: ''}));
                                    if (message) setMessage(null);
                                }}/>
                                <Label htmlFor="propect-type" className={`text-sm ${isLocal ? 'text-gray-500' : 'text-blue'}`}>
                                    International
                                </Label>
                            </div>

                           
                                <div className="space-y-2 mb-4">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                                id="phone_prefix"
                                                type="text"
                                                value={formData.phone_prefix}
                                                onChange={(e) => {
                                                    handleInputChange('phone_prefix', e.target.value)
                                                }}
                                                placeholder="+63"
                                                className="h-8 w-20"
                                                disabled={isLocal ? true : false}
                                                maxLength={5}
                                                required
                                            />
                                        <Input
                                            id="phone"
                                            type="number"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 15) {
                                                    handleInputChange('phone', e.target.value);
                                                }
                                            }}
                                            placeholder="Enter phone number"
                                            className="h-8 truncate"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                        Land Line
                                    </Label>
                                    <Input
                                    id="land_line"
                                    type="tel"
                                    value={formData.land_line}
                                    onChange={(e) => handleInputChange('land_line', e.target.value)}
                                    placeholder="Enter land line number"
                                    className="h-8 truncate"
                                    autoComplete="off"
                                    />
                                </div>

                            { !isLocal && (
                                <div className="space-y-4 mb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="communicationPreference" className="text-sm font-medium text-gray-700">
                                            Communication Preference *
                                        </Label>
                                        <Select
                                        value={formData.communicationPreference}
                                        onValueChange={(value) => {
                                            handleInputChange('communicationPreference', value);
                                            setFormData(prev => ({...prev, communicationAccount: '', otherCommunication: '' }));
                                        }}
                                        required>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder= "Select Preference" />
                                            </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="messenger">Messenger</SelectItem>
                                                        <SelectItem value="viber">Viber</SelectItem>
                                                        <SelectItem value="whatsapp">Whatsapp</SelectItem>
                                                        <SelectItem value="others">Others</SelectItem>
                                                    </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.communicationPreference === 'others' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="otherCommunication" className="text-sm font-medium text-gray-700">
                                                Please Specify *
                                            </Label>
                                            <Input
                                            id="otherCommunication"
                                            type="text"
                                            value={formData.otherCommunication}
                                            onChange={(e)=> handleInputChange('otherCommunication', e.target.value)}
                                            placeholder="Specify communication method"
                                            className="h-8 truncate"
                                            autoComplete="off"
                                            required/>
                                        </div>
                                    )}

                                    {formData.communicationPreference && (
                                        <div>
                                            <Label htmlFor="communicationAccount" className="text-sm font-medium text-gray-700">
                                                {formData.communicationPreference === 'messenger' && 'Messenger Account *'}
                                                {formData.communicationPreference === 'viber' && 'Viber Number *'}
                                                {formData.communicationPreference === 'whatsapp' && 'Whatsapp Number'}
                                                {formData.communicationPreference == 'others' && `${formData.otherCommunication} Account/Number *`}
                                            </Label>
                                            <Input
                                            id="communicationAccount"
                                            type="text"
                                            value={formData.communicationAccount}
                                            onChange={(e) => handleInputChange('communicationAccount', e.target.value)}
                                            placeholder= {
                                                formData.communicationPreference === 'messenger' ? 'Enter Messenger Account' :
                                                formData.communicationPreference === 'viber' ? 'Enter Viber Number' :
                                                formData.communicationPreference === 'whatsapp' ? 'Enter Whatsapp Number' :
                                                'Enter Account/Number'
                                            }
                                            className="h-8 truncate"
                                            autoComplete="off"
                                            required
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2">
                                    Address <span className="text-gray-400">(Optional)</span>
                                </Label>
                                <Input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address' , e.target.value)}
                                placeholder="Enter Address"
                                className="h-8 truncate mb-4"
                                autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="remarks" className="text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </Label>
                                <Input
                                id="remarks"
                                type="text"
                                value={formData.remarks}
                                onChange={(e) => handleInputChange('remarks' , e.target.value)}
                                placeholder="Enter Remarks"
                                className="h-8 truncate mb-4"
                                autoComplete="off"
                                />
                            </div>

                        <Button
                            type="submit"
                            // disabled= {!isFormValid || isLoading}
                            disabled= { isLoading}
                            className="w-full h-11"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    Checking Records...
                                </>
                            ):(
                                'Add Lead'
                            )}
                        </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <CurrentProspect prospects={prospects} />
                </div>
            </div>
        </div>
    )
}

export default ProspectPage;