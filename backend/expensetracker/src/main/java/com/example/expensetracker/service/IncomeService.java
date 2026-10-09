package com.example.expensetracker.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.dto.IncomeRequest;
import com.example.expensetracker.dto.IncomeResponse;
import com.example.expensetracker.entity.Income;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.IncomeRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public IncomeResponse addIncome(Integer userId, IncomeRequest request) {
        Income income = new Income();
        income.setUser(userRepository.getReferenceById(userId));
        apply(income, request);
        return IncomeResponse.from(incomeRepository.save(income));
    }

    @Transactional(readOnly = true)
    public List<IncomeResponse> getAllIncomes(Integer userId) {
        return incomeRepository.findByUserIdOrderByDateDescIdDesc(userId)
                .stream()
                .map(IncomeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public IncomeResponse getIncome(Integer userId, Integer id) {
        return IncomeResponse.from(findOwned(userId, id));
    }

    @Transactional
    public IncomeResponse updateIncome(Integer userId, Integer id, IncomeRequest request) {
        Income income = findOwned(userId, id);
        apply(income, request);
        return IncomeResponse.from(incomeRepository.save(income));
    }

    @Transactional
    public void deleteIncome(Integer userId, Integer id) {
        incomeRepository.delete(findOwned(userId, id));
    }

    // Looks the row up by BOTH id and owner. Someone else's row looks exactly like a missing row.
    private Income findOwned(Integer userId, Integer id) {
        return incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
    }

    private void apply(Income income, IncomeRequest request) {
        income.setSource(request.source().trim());
        income.setAmount(request.amount());
        income.setDate(request.date());
    }
}
