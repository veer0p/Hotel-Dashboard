import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';

const EditRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">Edit Room: {id}</h1>
            </div>
            <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                <p>Form to edit Room ID: {id} will be implemented here.</p>
                <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditRoom;
