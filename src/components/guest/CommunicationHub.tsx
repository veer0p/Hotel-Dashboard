"use client";

import { Box, Paper, Typography, Avatar, TextField, IconButton, Stack, Chip, Divider, InputAdornment } from "@mui/material";
import { Send, Mail, MessageSquare, Phone, Image, Paperclip, MoreVertical, Search, Smile } from "lucide-react";
import { useState } from "react";

interface Message {
    id: string;
    sender: 'hotel' | 'guest';
    text: string;
    time: string;
    channel: 'email' | 'sms' | 'whatsapp' | 'app';
    status?: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
    { id: '1', sender: 'hotel', text: 'Hello Sarah, welcome back! Your Royal Suite is ready.', time: '10:00 AM', channel: 'app', status: 'read' },
    { id: '2', sender: 'guest', text: 'Thank you! Can I request a late checkout for Thursday?', time: '10:15 AM', channel: 'app' },
    { id: '3', sender: 'hotel', text: 'Of course! We have extended your checkout to 2:00 PM.', time: '10:30 AM', channel: 'app', status: 'delivered' },
    { id: '4', sender: 'hotel', text: 'A pre-arrival champagne offer has been sent to your email.', time: 'Yesterday', channel: 'email', status: 'read' },
];

export function CommunicationHub() {
    const [inputText, setInputText] = useState("");

    return (
        <Paper elevation={0} sx={{ height: 600, display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" sx={{ width: 40, height: 40 }} />
                        <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, bgcolor: '#10B981', border: '2px solid white', borderRadius: '50%' }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Sarah Chen</Typography>
                        <Typography variant="caption" color="text.secondary">Omnichannel Thread • Online</Typography>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                    <IconButton size="small"><Search size={18} /></IconButton>
                    <IconButton size="small"><MoreVertical size={18} /></IconButton>
                </Stack>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockMessages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            alignSelf: msg.sender === 'hotel' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.sender === 'hotel' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: msg.sender === 'hotel' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                bgcolor: msg.sender === 'hotel' ? 'primary.main' : 'white',
                                color: msg.sender === 'hotel' ? 'white' : 'text.primary',
                                boxShadow: msg.sender === 'hotel' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                                border: msg.sender === 'hotel' ? 'none' : '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{msg.text}</Typography>
                        </Paper>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, px: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                                {msg.time} • via {msg.channel}
                            </Typography>
                            {msg.sender === 'hotel' && msg.status && (
                                <Typography variant="caption" color="primary" sx={{ fontSize: '0.65rem', fontWeight: 800 }}>
                                    {msg.status.toUpperCase()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message to Sarah..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton size="small"><Smile size={20} /></IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton size="small"><Image size={20} /></IconButton>
                                    <IconButton size="small"><Paperclip size={20} /></IconButton>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                    <IconButton
                                        size="small"
                                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                        disabled={!inputText}
                                    >
                                        <Send size={18} />
                                    </IconButton>
                                </Stack>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 4, py: 1.5 }
                    }}
                />
                <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                    <Chip label="Templates" size="small" variant="outlined" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => { }} />
                    <Chip label="Schedule" size="small" variant="outlined" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => { }} />
                    <Chip label="Internal Note" size="small" variant="outlined" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => { }} />
                </Box>
            </Box>
        </Paper>
    );
}
