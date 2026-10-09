package com.example.expensetracker.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.expensetracker.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    // Every query is filtered by the owner's id: a user can never reach another user's rows.
    List<Expense> findByUserIdOrderByDateDescIdDesc(Integer userId);

    Optional<Expense> findByIdAndUserId(Integer id, Integer userId);

    List<Expense> findTop5ByUserIdOrderByDateDescIdDesc(Integer userId);

    /** Returns null when the user has no expense rows. */
    @Query("select sum(e.amount) from Expense e where e.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Integer userId);

    /** Each row is [category, total], biggest category first. */
    @Query("select e.category, sum(e.amount) from Expense e where e.user.id = :userId "
            + "group by e.category order by sum(e.amount) desc")
    List<Object[]> sumAmountByCategory(@Param("userId") Integer userId);
}
