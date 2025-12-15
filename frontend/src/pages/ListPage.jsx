import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import purchaseOrderService from '../services/purchaseOrderService';
import PurchaseOrderList from '../components/PurchaseOrderList';
import PurchaseOrderFilters from '../components/PurchaseOrderFilters';

const ListPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await purchaseOrderService.getAllPurchaseOrders(filters);
            setOrders(data);
            setError('');
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Error al cargar las órdenes de compra');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const handleDelete = async (id) => {
        try {
            await purchaseOrderService.deletePurchaseOrder(id);
            setSnackbar({
                open: true,
                message: 'Orden de compra eliminada exitosamente',
                severity: 'success',
            });
            fetchOrders();
        } catch (err) {
            console.error('Error deleting order:', err);
            setSnackbar({
                open: true,
                message: 'Error al eliminar la orden de compra',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Órdenes de Compra
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/orders/new')}
                >
                    Nueva Orden
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <PurchaseOrderFilters
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            <PurchaseOrderList
                orders={orders}
                loading={loading}
                onDelete={handleDelete}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ListPage;
