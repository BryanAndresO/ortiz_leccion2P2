import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Grid,
    Paper,
    Typography,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';

const PurchaseOrderFilters = ({ onFilterChange, onClearFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        q: '',
        status: '',
        currency: '',
        minTotal: '',
        maxTotal: '',
        from: '',
        to: '',
    });

    const handleChange = (field) => (event) => {
        const newFilters = {
            ...filters,
            [field]: event.target.value,
        };
        setFilters(newFilters);
    };

    const handleApply = () => {
        // Remove empty filters
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});
        onFilterChange(activeFilters);
    };

    const handleClear = () => {
        const emptyFilters = {
            q: '',
            status: '',
            currency: '',
            minTotal: '',
            maxTotal: '',
            from: '',
            to: '',
        };
        setFilters(emptyFilters);
        onClearFilters();
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Filtros
                </Typography>
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? <ClearIcon /> : <FilterIcon />}
                </IconButton>
            </Box>

            <Collapse in={showFilters}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Buscar"
                            placeholder="Número de orden o proveedor"
                            value={filters.q}
                            onChange={handleChange('q')}
                            size="small"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            value={filters.status}
                            onChange={handleChange('status')}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="DRAFT">Borrador</MenuItem>
                            <MenuItem value="SUBMITTED">Enviada</MenuItem>
                            <MenuItem value="APPROVED">Aprobada</MenuItem>
                            <MenuItem value="REJECTED">Rechazada</MenuItem>
                            <MenuItem value="CANCELLED">Cancelada</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Moneda"
                            value={filters.currency}
                            onChange={handleChange('currency')}
                            size="small"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Monto Mínimo"
                            value={filters.minTotal}
                            onChange={handleChange('minTotal')}
                            size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Monto Máximo"
                            value={filters.maxTotal}
                            onChange={handleChange('maxTotal')}
                            size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Fecha Desde"
                            value={filters.from}
                            onChange={handleChange('from')}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Fecha Hasta"
                            value={filters.to}
                            onChange={handleChange('to')}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={handleClear}
                                startIcon={<ClearIcon />}
                            >
                                Limpiar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleApply}
                                startIcon={<FilterIcon />}
                            >
                                Aplicar Filtros
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Collapse>
        </Paper>
    );
};

export default PurchaseOrderFilters;
