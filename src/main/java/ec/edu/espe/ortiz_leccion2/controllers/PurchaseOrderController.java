package ec.edu.espe.ortiz_leccion2.controllers;

import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.ortiz_leccion2.services.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    // GET - Listar todas las órdenes de compra
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> listar() {
        return ResponseEntity.ok(purchaseOrderService.findAll());
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
