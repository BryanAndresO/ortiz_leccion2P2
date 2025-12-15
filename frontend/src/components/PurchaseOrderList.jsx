import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const statusColors = {
    DRAFT: 'default',
    SUBMITTED: 'info',
    APPROVED: 'success',
    REJECTED: 'error',
    CANCELLED: 'warning',
};

const PurchaseOrderList = ({ orders, loading, onDelete }) => {
    const navigate = useNavigate();

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

    const handleEdit = (id) => {
        navigate(`/orders/${id}/edit`);
    };

    const handleDelete = async (id, orderNumber) => {
        if (window.confirm(`¿Está seguro que desea eliminar la orden ${orderNumber}?`)) {
            await onDelete(id);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron órdenes de compra
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Crea tu primera orden de compra para comenzar
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Número de Orden</strong></TableCell>
                        <TableCell><strong>Proveedor</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell align="right"><strong>Monto</strong></TableCell>
                        <TableCell><strong>Entrega Esperada</strong></TableCell>
                        <TableCell><strong>Creada</strong></TableCell>
                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} hover>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{order.supplierName}</TableCell>
                            <TableCell>
                                <Chip
                                    label={order.status}
                                    color={statusColors[order.status] || 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="right">
                                {formatCurrency(order.totalAmount, order.currency)}
                            </TableCell>
                            <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => handleEdit(order.id)}
                                    title="Editar"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(order.id, order.orderNumber)}
                                    title="Eliminar"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PurchaseOrderList;
