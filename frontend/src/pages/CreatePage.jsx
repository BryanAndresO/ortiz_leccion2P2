import React from 'react';
import { Box, Typography } from '@mui/material';
import purchaseOrderService from '../services/purchaseOrderService';
import PurchaseOrderForm from '../components/PurchaseOrderForm';

const CreatePage = () => {
    const handleSubmit = async (data) => {
        await purchaseOrderService.createPurchaseOrder(data);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Crear Orden de Compra
            </Typography>
            <PurchaseOrderForm onSubmit={handleSubmit} isEdit={false} />
        </Box>
    );
};

export default CreatePage;
