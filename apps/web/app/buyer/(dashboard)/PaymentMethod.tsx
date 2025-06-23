import OfficeMap from "@/components/Maps/OfficeMap";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { MapPinIcon } from "lucide-react";

export default function PaymentMethod({
    setIsDialogOpen
}: {
    setIsDialogOpen: (isOpen: boolean) => void;
}) {

    return <>
    <h3 className="text-sm font-medium mb-4 p-4">Payment Methods</h3>
              <Tabs defaultValue="credit-card" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card">Unionbank</TabsTrigger>
                  <TabsTrigger value="cash">Cash</TabsTrigger>
                </TabsList>

                <div className="h-250px">
                  <TabsContent value="credit-card" className="mt-2 h-full">
                    <Card className="border shadow-sm h-full">
                      <CardContent className="p-4 h-full">
                        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                          <div className="lg:col-span-5">
                            <div className="p-4 bg-muted rounded-md">
                              <img
                                src="/images/unionbank.svg"
                                alt="UnionBank Logo"
                                className="h-6 mb-3"
                              />
                              <p className="mb-1 text-xs text-muted-foreground">Account Name:</p>
                              <p className="text-xs font-medium mb-3">Metaland Properties Inc.</p>
                              <p className="mb-1 text-xs text-muted-foreground">Account Number:</p>
                              <p className="text-xs font-medium">00-322-000023-8</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 w-full max-w-xs">
                            <Label htmlFor="qr-code" className="text-xs">Scan QR Code</Label>
                            <Button
                              id="qr-code"
                              size="sm"
                              className="h-8 px-4 text-xs w-full"
                              onClick={ () =>  setIsDialogOpen(true) }
                            >
                              Open
                            </Button>
                            
                            <p className="text-xs text-muted-foreground mt-2">
                              Please include your reservation ID in the payment reference.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="cash" className="mt-2 h-250px">
                    <Card className="border shadow-sm h-full">
                      <CardContent className="p-4 h-full">
                        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-1">
                          <div className="lg:col-span-5">
                            <div className="p-4 bg-muted rounded-md">
                              <img
                                src="/images/logo-nobackground.svg"
                                alt="Metaland Logo"
                                className="h-6 mb-3"
                              />
                              <p className="mb-2 text-sm font-medium">Cash Payment Instructions</p>
                              <p className="mb-1 text-xs text-muted-foreground">Visit our office at:</p>
                              <p className="text-xs font-medium mb-2">36C, Cebu Exchange Tower, Salinas Drive Lahug, Cebu City, 6000</p>
                              <p className="mb-1 text-xs text-muted-foreground">Hours:</p>
                              <p className="text-xs font-medium mb-2">9:00 AM - 6:00 PM, Mon-Sat</p>
                              <p className="text-xs text-muted-foreground">Please bring a valid ID for verification</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs">Office Location</Label>
                            <div className="w-full rounded-md">
                              <OfficeMap lat={10.3272783} lng={123.9045435}  />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
    </>
}