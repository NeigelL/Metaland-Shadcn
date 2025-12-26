"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { MessageSquare, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";

// Dummy Agents
const agents = [
    { id: "agent-1", name: "Sarah Williams" },
    { id: "agent-2", name: "Mike Johnson" },
    { id: "agent-3", name: "Emily Brown" },
];

export default function ReservationsPage() {
    const searchParams = useSearchParams();
    const lotId = searchParams.get("lotId");
    const projectId = searchParams.get("projectId");
    const price = searchParams.get("price");

    const [activeTab, setActiveTab] = useState("new");
    const [formData, setFormData] = useState({
        buyerName: "",
        email: "",
        contact: "",
        terms: "12",
        downPayment: "",
        agentId: "",
    });

    const [reservations, setReservations] = useState([
        { id: "res-1", buyer: "John Doe", lot: "Block 1 Lot 5", project: "Metaland Heights", status: "Pending", agent: "Sarah Williams", notes: "Waiting for payment proof." },
        { id: "res-2", buyer: "Jane Smith", lot: "Block 2 Lot 3", project: "Sunnyvale Estates", status: "Approved", agent: "Mike Johnson", notes: "All clear." },
    ]);

    const [promoDiscount, setPromoDiscount] = useState(0);

    // Calculate promo based on downpayment
    useEffect(() => {
        if (price && formData.downPayment) {
            const dpAmount = parseFloat(formData.downPayment);
            const priceAmount = parseFloat(price);
            if (dpAmount >= priceAmount * 0.5) {
                setPromoDiscount(5); // 5% if 50% DP
            } else if (dpAmount >= priceAmount * 0.2) {
                setPromoDiscount(2); // 2% if 20% DP
            } else {
                setPromoDiscount(0);
            }
        }
    }, [formData.downPayment, price]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateReservation = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        const newRes = {
            id: `res-${Date.now()}`,
            buyer: formData.buyerName,
            lot: lotId ? `Lot ${lotId}` : "Selected Lot",
            project: projectId ? "Project" : "General Inquiry",
            status: "Pending",
            agent: agents.find(a => a.id === formData.agentId)?.name || "Unassigned",
            notes: "New reservation submitted."
        };
        setReservations([newRes, ...reservations]);
        setActiveTab("list");
        alert("Reservation Submitted for Review!");
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            COMING SOON
            {/* <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reservations</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="new">New Reservation</TabsTrigger>
                    <TabsTrigger value="list">All Reservations</TabsTrigger>
                </TabsList>

                <TabsContent value="new">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Buyer Information</CardTitle>
                                <CardDescription>Enter details for the new reservation.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateReservation} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="buyerName">Buyer Name</Label>
                                        <Input id="buyerName" name="buyerName" placeholder="Full Name" required value={formData.buyerName} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact">Contact No.</Label>
                                            <Input id="contact" name="contact" placeholder="+63 900 000 0000" required value={formData.contact} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="agent">Sales Agent</Label>
                                        <Select onValueChange={(val) => setFormData({ ...formData, agentId: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Agent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agents.map(agent => (
                                                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Terms & Verification</CardTitle>
                                <CardDescription>Configure payment details and submit.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {lotId && (
                                    <div className="bg-slate-100 p-4 rounded-md mb-4">
                                        <h4 className="font-semibold text-sm">Selected Lot: {lotId}</h4>
                                        <p className="text-xs text-muted-foreground">Price: ₱{parseInt(price || "0").toLocaleString()}</p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="terms">Terms (Months)</Label>
                                    <Select defaultValue="12" onValueChange={(val) => setFormData({ ...formData, terms: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Terms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12">12 Months (0% Interest)</SelectItem>
                                            <SelectItem value="24">24 Months</SelectItem>
                                            <SelectItem value="36">36 Months</SelectItem>
                                            <SelectItem value="48">48 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="downPayment">Down Payment Amount</Label>
                                    <Input id="downPayment" name="downPayment" type="number" placeholder="Enter Amount" value={formData.downPayment} onChange={handleInputChange} />
                                    {promoDiscount > 0 && (
                                        <div className="flex items-center text-green-600 text-sm mt-1">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Applies {promoDiscount}% Discount!
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleCreateReservation}>Submit Reservation</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="list">
                    <div className="grid gap-4">
                        {reservations.map((res) => (
                            <Card key={res.id}>
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">{res.project} - {res.lot}</CardTitle>
                                        <CardDescription>Buyer: {res.buyer} | Agent: {res.agent}</CardDescription>
                                    </div>
                                    <Badge variant={res.status === 'Approved' ? 'default' : 'secondary'}>
                                        {res.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-50 p-4 rounded-md">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Office Chat / Notes
                                        </h4>
                                        <div className="space-y-2 max-h-[100px] overflow-y-auto mb-3">
                                            <div className="text-sm">
                                                <span className="font-bold text-xs">System:</span> Reservation created.
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-xs text-blue-600">Office:</span> Please upload ID.
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input placeholder="Type a message..." className="h-8 text-sm" />
                                            <Button size="sm" variant="ghost">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs> */}
        </div>
    );
}
