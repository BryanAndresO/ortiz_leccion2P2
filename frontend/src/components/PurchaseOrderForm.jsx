import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Paper,
    Typography,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

const PurchaseOrderForm = ({ initialData, onSubmit, isEdit = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        orderNumber: '',
        supplierName: '',
        status: 'DRAFT',
        totalAmount: '',
        currency: 'USD',
        expectedDeliveryDate: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                orderNumber: initialData.orderNumber || '',
                supplierName: initialData.supplierName || '',
                status: initialData.status || 'DRAFT',
                totalAmount: initialData.totalAmount || '',
                currency: initialData.currency || 'USD',
                expectedDeliveryDate: initialData.expectedDeliveryDate
                    ? initialData.expectedDeliveryDate.split('T')[0]
                    : '',
            });
        }
    }, [initialData]);

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.orderNumber.trim()) {
            setError('El número de orden es requerido');
            return false;
        }
        if (!formData.supplierName.trim()) {
            setError('El nombre del proveedor es requerido');
            return false;
        }
        if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
            setError('El monto total debe ser mayor a 0');
            return false;
        }
        if (!formData.expectedDeliveryDate) {
            setError('La fecha de entrega esperada es requerida');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = {
                ...formData,
                totalAmount: parseFloat(formData.totalAmount),
            };

            await onSubmit(submitData);
            navigate('/orders');
        } catch (err) {
            console.error('Form submission error:', err);
            setError(
                err.response?.data?.message ||
                err.message ||
                'Ocurrió un error al guardar la orden de compra'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {isEdit ? 'Editar Orden de Compra' : 'Crear Nueva Orden de Compra'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            label="Número de Orden"
                            value={formData.orderNumber}
                            onChange={handleChange('orderNumber')}
                            placeholder="OC-2025-000001"
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            label="Nombre del Proveedor"
                            value={formData.supplierName}
                            onChange={handleChange('supplierName')}
                            placeholder="Corporación ACME"
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            select
                            label="Estado"
                            value={formData.status}
                            onChange={handleChange('status')}
                            disabled={loading}
                        >
                            <MenuItem value="DRAFT">Borrador</MenuItem>
                            <MenuItem value="SUBMITTED">Enviada</MenuItem>
                            <MenuItem value="APPROVED">Aprobada</MenuItem>
                            <MenuItem value="REJECTED">Rechazada</MenuItem>
                            <MenuItem value="CANCELLED">Cancelada</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            select
                            label="Moneda"
                            value={formData.currency}
                            onChange={handleChange('currency')}
                            disabled={loading}
                        >
                            <MenuItem value="USD">USD - Dólar Estadounidense</MenuItem>
                            <MenuItem value="EUR">EUR - Euro</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Monto Total"
                            value={formData.totalAmount}
                            onChange={handleChange('totalAmount')}
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Fecha de Entrega Esperada"
                            value={formData.expectedDeliveryDate}
                            onChange={handleChange('expectedDeliveryDate')}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default PurchaseOrderForm;
