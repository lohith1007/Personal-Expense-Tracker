package com.example.expensetracker.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.expensetracker.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Integer> {

    // Every query is filtered by the owner's id: a user can never reach another user's rows.
    List<Income> findByUserIdOrderByDateDescIdDesc(Integer userId);

    Optional<Income> findByIdAndUserId(Integer id, Integer userId);

    List<Income> findTop5ByUserIdOrderByDateDescIdDesc(Integer userId);

    /** Returns null when the user has no income rows. */
    @Query("select sum(i.amount) from Income i where i.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Integer userId);
}
