package ec.edu.espe.ortiz_leccion2.specifications;

import ec.edu.espe.ortiz_leccion2.models.dto.PurchaseOrderFilterDTO;
import ec.edu.espe.ortiz_leccion2.models.entities.PurchaseOrder;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PurchaseOrderSpecification {

    /**
     * Crea una especificación dinámica basada en los filtros proporcionados
     */
    public static Specification<PurchaseOrder> withFilters(PurchaseOrderFilterDTO filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro de búsqueda de texto (q) - case insensitive
            if (filters.getQ() != null && !filters.getQ().trim().isEmpty()) {
                String searchPattern = "%" + filters.getQ().toLowerCase() + "%";
                Predicate orderNumberPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("orderNumber")),
                        searchPattern);
                Predicate supplierNamePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("supplierName")),
                        searchPattern);
                predicates.add(criteriaBuilder.or(orderNumberPredicate, supplierNamePredicate));
            }

            // Filtro por status
            if (filters.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filters.getStatus()));
            }

            // Filtro por currency
            if (filters.getCurrency() != null) {
                predicates.add(criteriaBuilder.equal(root.get("currency"), filters.getCurrency()));
            }

            // Filtro por monto mínimo
            if (filters.getMinTotal() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("totalAmount"), filters.getMinTotal()));
            }

            // Filtro por monto máximo
            if (filters.getMaxTotal() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("totalAmount"), filters.getMaxTotal()));
            }

            // Filtro por fecha desde (from)
            if (filters.getFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), filters.getFrom()));
            }

            // Filtro por fecha hasta (to)
            if (filters.getTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), filters.getTo()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
