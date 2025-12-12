package ec.edu.espe.ortiz_leccion2.models.dto;

import ec.edu.espe.ortiz_leccion2.models.enums.Currency;
import ec.edu.espe.ortiz_leccion2.models.enums.OrderStatus;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseOrderFilterDTO {

    private String q; // Búsqueda de texto en orderNumber y supplierName
    private OrderStatus status; // Filtro por estado
    private Currency currency; // Filtro por moneda

    @DecimalMin(value = "0.0", inclusive = true, message = "El monto mínimo debe ser mayor o igual a 0")
    private BigDecimal minTotal; // Monto mínimo

    @DecimalMin(value = "0.0", inclusive = true, message = "El monto máximo debe ser mayor o igual a 0")
    private BigDecimal maxTotal; // Monto máximo

    private LocalDateTime from; // Fecha desde (createdAt)
    private LocalDateTime to; // Fecha hasta (createdAt)

    // Constructor vacío
    public PurchaseOrderFilterDTO() {
    }

    // Getters y Setters

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public BigDecimal getMinTotal() {
        return minTotal;
    }

    public void setMinTotal(BigDecimal minTotal) {
        this.minTotal = minTotal;
    }

    public BigDecimal getMaxTotal() {
        return maxTotal;
    }

    public void setMaxTotal(BigDecimal maxTotal) {
        this.maxTotal = maxTotal;
    }

    public LocalDateTime getFrom() {
        return from;
    }

    public void setFrom(LocalDateTime from) {
        this.from = from;
    }

    public LocalDateTime getTo() {
        return to;
    }

    public void setTo(LocalDateTime to) {
        this.to = to;
    }
}
