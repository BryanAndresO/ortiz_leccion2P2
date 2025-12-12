package ec.edu.espe.ortiz_leccion2.services;

import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.ortiz_leccion2.repositories.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> findAll() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder findById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public PurchaseOrder save(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    @Transactional
    public PurchaseOrder update(Long id, PurchaseOrder purchaseOrder) {
        PurchaseOrder existingOrder = findById(id);

        existingOrder.setOrderNumber(purchaseOrder.getOrderNumber());
        existingOrder.setSupplierName(purchaseOrder.getSupplierName());
        existingOrder.setStatus(purchaseOrder.getStatus());
        existingOrder.setTotalAmount(purchaseOrder.getTotalAmount());
        existingOrder.setCurrency(purchaseOrder.getCurrency());
        existingOrder.setExpectedDeliveryDate(purchaseOrder.getExpectedDeliveryDate());

        return purchaseOrderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        PurchaseOrder purchaseOrder = findById(id);
        purchaseOrderRepository.delete(purchaseOrder);
    }
}
