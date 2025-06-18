package com.islandscholars.repository;

import com.islandscholars.model.Event;
import com.islandscholars.model.EventStatus;
import com.islandscholars.model.EventType;
import com.islandscholars.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganization(User organization);
    List<Event> findByStatus(EventStatus status);
    List<Event> findByEventType(EventType eventType);
    List<Event> findByStatusAndStartDateAfter(EventStatus status, LocalDateTime date);
    List<Event> findByStatusAndRegistrationDeadlineAfter(EventStatus status, LocalDateTime date);
    List<Event> findByLocationContainingIgnoreCase(String location);
    List<Event> findByIsVirtual(boolean isVirtual);
}