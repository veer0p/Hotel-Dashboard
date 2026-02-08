import MainLayout from "@/layouts/MainLayout";
import { Typography, Box, Paper } from "@mui/material";

export default function CheckinPage() {
    return (
        <MainLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Check-in / Check-out
                </Typography>
                <Typography color="text.secondary">
                    Streamline guest arrivals and departures.
                </Typography>
            </Box>
            <Paper sx={{ p: 10, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    Check-in Workflow implementation coming soon...
                </Typography>
            </Paper>
        </MainLayout>
    );
}
