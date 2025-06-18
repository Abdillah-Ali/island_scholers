package com.islandscholars.controller;

import com.islandscholars.model.Event;
import com.islandscholars.model.User;
import com.islandscholars.repository.UserRepository;
import com.islandscholars.security.services.UserDetailsImpl;
import com.islandscholars.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllActiveEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok().body(event))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User organization = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        event.setOrganization(organization);
        Event savedEvent = eventService.createEvent(event);
        return ResponseEntity.ok(savedEvent);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event eventDetails,
                                            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Verify that the event belongs to the authenticated organization
        Event existingEvent = eventService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!existingEvent.getOrganization().getId().equals(userDetails.getId())) {
            return ResponseEntity.forbiddenBuild();
        }
        
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Verify that the event belongs to the authenticated organization
        Event existingEvent = eventService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!existingEvent.getOrganization().getId().equals(userDetails.getId())) {
            return ResponseEntity.forbiddenBuild();
        }
        
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<List<Event>> getMyEvents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User organization = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Event> events = eventService.getEventsByOrganization(organization);
        return ResponseEntity.ok(events);
    }
}