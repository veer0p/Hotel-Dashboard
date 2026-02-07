import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HelpCircle, Mail, MessageSquare, Phone, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HelpSupport: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">Help & Support</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I create a new booking?</AccordionTrigger>
                                    <AccordionContent>
                                        Navigate to the Bookings page and click on the "Add Booking" button at the top right corner. Fill in the guest information and selected room details.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can I modify an existing room's status?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, go to the Rooms page, find the room you wish to modify, and click the "Edit" button or "View" to see detail options for changing status (Available, Occupied, Cleaning, etc.).
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How are reports generated?</AccordionTrigger>
                                    <AccordionContent>
                                        Reports are automatically generated based on booking data, room occupancy, and revenue. You can view them in the Reports section with filters for different time ranges.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email Support</p>
                                    <p className="text-xs text-muted-foreground">support@grandpalace.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Phone Support</p>
                                    <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <Button className="w-full gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Live Chat (Offline)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
