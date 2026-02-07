import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">Admin Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-primary">AU</span>
                        </div>
                        <CardTitle>Admin User</CardTitle>
                        <CardDescription>Hotel Administrator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full">Change Password</Button>
                        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">Logout</Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" /> Name
                                </p>
                                <p className="font-medium">Admin User</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email
                                </p>
                                <p className="font-medium">admin@grandpalace.com</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Role
                                </p>
                                <p className="font-medium">Super Admin</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-4">This profile is currently a placeholder. Comprehensive profile management with editing capabilities will be implemented soon.</p>
                            <Button variant="outline" disabled>Edit Profile Details</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MyProfile;
