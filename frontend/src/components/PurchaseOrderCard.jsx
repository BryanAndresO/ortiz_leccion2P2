import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Divider,
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const statusColors = {
    DRAFT: 'default',
    SUBMITTED: 'info',
    APPROVED: 'success',
    REJECTED: 'error',
    CANCELLED: 'warning',
};

const PurchaseOrderCard = ({ order }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(amount);
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div" noWrap>
                        {order.orderNumber}
                    </Typography>
                    <Chip
                        label={order.status}
                        color={statusColors[order.status] || 'default'}
                        size="small"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.supplierName}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MoneyIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary">
                        {formatCurrency(order.totalAmount, order.currency)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        Expected: {formatDate(order.expectedDeliveryDate)}
                    </Typography>
                </Box>

                {order.createdAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Created: {formatDate(order.createdAt)}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default PurchaseOrderCard;
