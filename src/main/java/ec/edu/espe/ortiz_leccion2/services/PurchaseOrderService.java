package ec.edu.espe.ortiz_leccion2.services;

import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import java.util.List;

public interface PurchaseOrderService {

    List<PurchaseOrder> findAll();

    PurchaseOrder findById(Long id);

    PurchaseOrder save(PurchaseOrder purchaseOrder);

    PurchaseOrder update(Long id, PurchaseOrder purchaseOrder);

    void delete(Long id);
}
