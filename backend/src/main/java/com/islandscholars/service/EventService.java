package com.islandscholars.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.islandscholars.model.Event;
import com.islandscholars.model.EventStatus;
import com.islandscholars.model.User;
import com.islandscholars.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllActiveEvents() {
        return eventRepository.findByStatusAndStartDateAfter(EventStatus.ACTIVE, LocalDateTime.now());
    }

    public List<Event> getEventsByOrganization(User organization) {
        return eventRepository.findByOrganization(organization);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventType(eventDetails.getEventType());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setLocation(eventDetails.getLocation());
        event.setVirtual(eventDetails.isVirtual());
        event.setMaxParticipants(eventDetails.getMaxParticipants());
        event.setRegistrationDeadline(eventDetails.getRegistrationDeadline());
        event.setRequirements(eventDetails.getRequirements());
        event.setPrizes(eventDetails.getPrizes());
        event.setTags(eventDetails.getTags());
        event.setStatus(eventDetails.getStatus());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStatusAndStartDateAfter(EventStatus.ACTIVE, LocalDateTime.now())
                .stream()
                .limit(6)
                .toList();
    }
}