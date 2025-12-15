import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    ShoppingCart as OrderIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import purchaseOrderService from '../services/purchaseOrderService';
import PurchaseOrderCard from './PurchaseOrderCard';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        usd: 0,
        eur: 0,
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await purchaseOrderService.getAllPurchaseOrders();
            setOrders(data);
            calculateStats(data);
            setError('');
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Error al cargar las órdenes de compra');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orderData) => {
        const stats = {
            total: orderData.length,
            approved: orderData.filter(o => o.status === 'APPROVED').length,
            rejected: orderData.filter(o => o.status === 'REJECTED').length,
            pending: orderData.filter(o => ['DRAFT', 'SUBMITTED'].includes(o.status)).length,
            usd: orderData.filter(o => o.currency === 'USD').length,
            eur: orderData.filter(o => o.currency === 'EUR').length,
        };
        setStats(stats);
    };

    const StatCard = ({ title, value, icon, color }) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ color: color, fontSize: 48 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Panel de Control
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Órdenes"
                        value={stats.total}
                        icon={<OrderIcon fontSize="inherit" />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Aprobadas"
                        value={stats.approved}
                        icon={<ApprovedIcon fontSize="inherit" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Rechazadas"
                        value={stats.rejected}
                        icon={<RejectedIcon fontSize="inherit" />}
                        color="error.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pendientes"
                        value={stats.pending}
                        icon={<PendingIcon fontSize="inherit" />}
                        color="warning.main"
                    />
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Órdenes Recientes
            </Typography>

            <Grid container spacing={3}>
                {orders.slice(0, 6).map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <PurchaseOrderCard order={order} />
                    </Grid>
                ))}
            </Grid>

            {orders.length === 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    No hay órdenes aún. ¡Crea tu primera orden de compra!
                </Typography>
            )}
        </Box>
    );
};

export default Dashboard;
