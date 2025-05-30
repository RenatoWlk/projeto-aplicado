package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.model.CalendarEvent;
import com.projeto.aplicado.backend.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CalendarEventService {

    @Autowired
    private CalendarEventRepository repository;

    public CalendarEvent save(CalendarEvent event) {
        return repository.save(event);
    }

    public List<CalendarEvent> getEventsByDate(LocalDate date) {
        return repository.findByDate(date);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public CalendarEvent update(CalendarEvent event) {
        return repository.save(event);
    }

}