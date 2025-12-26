"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Plus, Search, Mail, Phone } from "lucide-react";

export default function BuyersPage() {
    const [buyers, setBuyers] = useState([
        { id: "1", name: "Alice Guo", email: "alice@example.com", phone: "0917-111-2222", status: "Active", leadSource: "Facebook" },
        { id: "2", name: "Bob Ong", email: "bob@example.com", phone: "0918-333-4444", status: "Lead", leadSource: "Referral" },
    ]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newBuyer, setNewBuyer] = useState({ name: "", email: "", phone: "", leadSource: "" });

    const handleAddBuyer = (e: React.FormEvent) => {
        e.preventDefault();
        setBuyers([...buyers, { id: `b-${Date.now()}`, ...newBuyer, status: "Lead" }]);
        setIsAddOpen(false);
        setNewBuyer({ name: "", email: "", phone: "", leadSource: "" });
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            COMING SOON
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Buyers & Leads</h2>
                    <p className="text-muted-foreground">Track your potential clients and active buyers.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Buyer / Lead</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Buyer</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddBuyer} className="space-y-4 mt-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input value={newBuyer.name} onChange={e => setNewBuyer({ ...newBuyer, name: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input type="email" value={newBuyer.email} onChange={e => setNewBuyer({ ...newBuyer, email: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={newBuyer.phone} onChange={e => setNewBuyer({ ...newBuyer, phone: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Source (e.g. Facebook, Referral)</Label>
                                <Input value={newBuyer.leadSource} onChange={e => setNewBuyer({ ...newBuyer, leadSource: e.target.value })} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Buyer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Input placeholder="Search buyers..." className="w-[150px] lg:w-[250px]" />
                <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buyers.map((buyer) => (
                                <TableRow key={buyer.id}>
                                    <TableCell className="font-medium">{buyer.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3 mr-1" /> {buyer.email}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3 mr-1" /> {buyer.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>{buyer.leadSource}</TableCell>
                                    <TableCell>{buyer.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card> */}
        </div>
    );
}
