package ec.edu.espe.ortiz_leccion2.controllers;

import ec.edu.espe.ortiz_leccion2.models.dto.PurchaseOrderFilterDTO;
import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.ortiz_leccion2.models.enums.Currency;
import ec.edu.espe.ortiz_leccion2.models.enums.OrderStatus;
import ec.edu.espe.ortiz_leccion2.services.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    /**
     * GET - Listar todas las órdenes de compra con filtros opcionales
     * 
     * Filtros disponibles:
     * - q: búsqueda de texto en orderNumber y supplierName (case-insensitive)
     * - status: filtro por estado (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
     * - currency: filtro por moneda (USD, EUR)
     * - minTotal: monto mínimo (>= 0)
     * - maxTotal: monto máximo (>= 0)
     * - from: fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)
     * - to: fecha hasta (formato: yyyy-MM-dd'T'HH:mm:ss)
     * 
     * Ejemplo: GET
     * /api/v1/purchase-orders?q=acme&status=APPROVED&from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
     */
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) BigDecimal minTotal,
            @RequestParam(required = false) BigDecimal maxTotal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        // Si no hay filtros, devolver todos
        if (q == null && status == null && currency == null &&
                minTotal == null && maxTotal == null && from == null && to == null) {
            return ResponseEntity.ok(purchaseOrderService.findAll());
        }

        // Construir DTO de filtros
        PurchaseOrderFilterDTO filters = new PurchaseOrderFilterDTO();
        filters.setQ(q);

        // Convertir status a enum si viene
        if (status != null && !status.trim().isEmpty()) {
            try {
                filters.setStatus(OrderStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Valor de status inválido: " + status +
                        ". Valores permitidos: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED");
            }
        }

        // Convertir currency a enum si viene
        if (currency != null && !currency.trim().isEmpty()) {
            try {
                filters.setCurrency(Currency.valueOf(currency.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Valor de currency inválido: " + currency +
                        ". Valores permitidos: USD, EUR");
            }
        }

        filters.setMinTotal(minTotal);
        filters.setMaxTotal(maxTotal);
        filters.setFrom(from);
        filters.setTo(to);

        return ResponseEntity.ok(purchaseOrderService.findAllWithFilters(filters));
    }

    // POST - Crear una nueva orden de compra
    @PostMapping
    public ResponseEntity<PurchaseOrder> crear(@Valid @RequestBody PurchaseOrder purchaseOrder) {
        return ResponseEntity.ok(purchaseOrderService.save(purchaseOrder));
    }

    // GET - Obtener una orden de compra por ID
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.findById(id));
    }

    // PUT - Actualizar una orden de compra
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> actualizar(@PathVariable Long id,
            @Valid @RequestBody PurchaseOrder purchaseOrder) {
        return ResponseEntity.ok(purchaseOrderService.update(id, purchaseOrder));
    }

    // DELETE - Eliminar una orden de compra
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        purchaseOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
