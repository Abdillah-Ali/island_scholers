from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListView.as_view(), name='event-list'),
    path('upcoming/', views.upcoming_events, name='upcoming-events'),
    path('create/', views.EventCreateView.as_view(), name='event-create'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/update/', views.EventUpdateView.as_view(), name='event-update'),
    path('<int:pk>/delete/', views.EventDeleteView.as_view(), name='event-delete'),
    path('<int:event_id>/analytics/', views.event_analytics, name='event-analytics'),
    path('<int:event_id>/participants/', views.EventParticipantsView.as_view(), name='event-participants'),
    path('<int:event_id>/feedback/', views.EventFeedbackListView.as_view(), name='event-feedback'),
    path('my-events/', views.OrganizationEventsView.as_view(), name='my-events'),
    path('register/', views.EventRegistrationView.as_view(), name='event-register'),
    path('my-registrations/', views.StudentEventRegistrationsView.as_view(), name='my-registrations'),
    path('registrations/<int:registration_id>/cancel/', views.cancel_event_registration, name='cancel-registration'),
    path('feedback/create/', views.EventFeedbackCreateView.as_view(), name='create-feedback'),
]