package ec.edu.espe.ortiz_leccion2.services;

import ec.edu.espe.ortiz_leccion2.exceptions.InvalidFilterException;
import ec.edu.espe.ortiz_leccion2.exceptions.ResourceNotFoundException;
import ec.edu.espe.ortiz_leccion2.models.dto.PurchaseOrderFilterDTO;
import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.ortiz_leccion2.repositories.PurchaseOrderRepository;
import ec.edu.espe.ortiz_leccion2.specifications.PurchaseOrderSpecification;
import org.springframework.data.jpa.domain.Specification;
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
    public List<PurchaseOrder> findAllWithFilters(PurchaseOrderFilterDTO filters) {
        // Validar reglas de negocio
        validateFilters(filters);

        // Crear especificación dinámica
        Specification<PurchaseOrder> spec = PurchaseOrderSpecification.withFilters(filters);

        // Ejecutar consulta
        return purchaseOrderRepository.findAll(spec);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder findById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order no encontrada con id: " + id));
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

    /**
     * Valida las reglas de negocio de los filtros
     */
    private void validateFilters(PurchaseOrderFilterDTO filters) {
        // Validar que from <= to
        if (filters.getFrom() != null && filters.getTo() != null) {
            if (filters.getFrom().isAfter(filters.getTo())) {
                throw new InvalidFilterException("La fecha 'from' no puede ser posterior a la fecha 'to'");
            }
        }

        // Validar que minTotal <= maxTotal
        if (filters.getMinTotal() != null && filters.getMaxTotal() != null) {
            if (filters.getMinTotal().compareTo(filters.getMaxTotal()) > 0) {
                throw new InvalidFilterException("El monto mínimo no puede ser mayor que el monto máximo");
            }
        }
    }
}
