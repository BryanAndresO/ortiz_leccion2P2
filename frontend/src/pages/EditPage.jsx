import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import purchaseOrderService from '../services/purchaseOrderService';
import PurchaseOrderForm from '../components/PurchaseOrderForm';

const EditPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await purchaseOrderService.getPurchaseOrderById(id);
            setOrder(data);
            setError('');
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Error al cargar la orden de compra');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        await purchaseOrderService.updatePurchaseOrder(id, data);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Editar Orden de Compra
            </Typography>
            {order && (
                <PurchaseOrderForm
                    initialData={order}
                    onSubmit={handleSubmit}
                    isEdit={true}
                />
            )}
        </Box>
    );
};

export default EditPage;
