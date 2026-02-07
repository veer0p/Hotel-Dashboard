import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const RoomDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">Room Details: {id}</h1>
            </div>
            <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                <p>Detailed information for Room ID: {id} will be displayed here.</p>
                <Button className="mt-4" onClick={() => navigate(`/rooms/${id}/edit`)}>
                    Edit Room
                </Button>
            </div>
        </div>
    );
};

export default RoomDetails;
