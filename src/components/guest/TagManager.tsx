"use client";

import { Box, Chip, Typography, Paper, IconButton, Stack, Tooltip, TextField, InputAdornment } from "@mui/material";
import { Plus, Tag as TagIcon, X, Sparkles, Filter } from "lucide-react";
import { useState, useCallback } from "react";

interface TagManagerProps {
    tags: string[];
    onAddTag?: (tag: string) => void;
    onRemoveTag?: (tag: string) => void;
}

const autoTagDescriptions: Record<string, string> = {
    'VIP': 'High lifetime value (> $5,000)',
    'Loyal': 'More than 10 stays',
    'Business': 'Frequent weekday stays',
    'Tech': 'Works in technology sector',
    'Suite Lover': 'Always books suites',
    'Weekend Warrior': 'Frequent weekend stays'
};

export function TagManager({ tags, onAddTag, onRemoveTag }: TagManagerProps) {
    const [newTag, setNewTag] = useState("");

    const handleAdd = () => {
        if (newTag && !tags.includes(newTag)) {
            onAddTag?.(newTag);
            setNewTag("");
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TagIcon size={18} color="#64748B" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                        Smart Tags
                    </Typography>
                </Box>
                <Tooltip title="Auto-generation active">
                    <Sparkles size={16} color="#8B5CF6" />
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {tags.map((tag) => (
                    <Tooltip key={tag} title={autoTagDescriptions[tag] || 'Manual tag'} arrow>
                        <Chip
                            label={tag}
                            onDelete={onRemoveTag ? () => onRemoveTag(tag) : undefined}
                            deleteIcon={<X size={14} />}
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: 'action.hover',
                                border: '1px solid',
                                borderColor: 'divider',
                                '& .MuiChip-deleteIcon': {
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main' }
                                }
                            }}
                        />
                    </Tooltip>
                ))}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 10,
                        border: '1px dashed',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                    }}
                    onClick={() => {/* Toggle input */ }}
                >
                    <Plus size={14} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Add Tag</Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    bgcolor: '#F8FAFC',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Filter size={14} color="#64748B" />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Segment Insights
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Sarah belongs to the <Typography component="span" color="primary" sx={{ fontWeight: 800 }}>"High Value Tech Professional"</Typography> segment.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Guests in this segment spend 45% more than average and prefer early check-ins.
                </Typography>
            </Paper>
        </Box>
    );
}
