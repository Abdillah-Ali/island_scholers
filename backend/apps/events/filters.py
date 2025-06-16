import django_filters
from django.utils import timezone
from .models import Event

class EventFilter(django_filters.FilterSet):
    event_type = django_filters.ChoiceFilter(choices=Event.EVENT_TYPES)
    location = django_filters.CharFilter(lookup_expr='icontains')
    is_virtual = django_filters.BooleanFilter()
    start_date_after = django_filters.DateTimeFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = django_filters.DateTimeFilter(field_name='start_date', lookup_expr='lte')
    registration_open = django_filters.BooleanFilter(method='filter_registration_open')
    tags = django_filters.CharFilter(method='filter_tags')
    
    class Meta:
        model = Event
        fields = ['event_type', 'location', 'is_virtual']
    
    def filter_registration_open(self, queryset, name, value):
        if value:
            now = timezone.now()
            return queryset.filter(
                status='active',
                registration_deadline__gt=now
            )
        return queryset
    
    def filter_tags(self, queryset, name, value):
        if value:
            tags = [tag.strip() for tag in value.split(',')]
            return queryset.filter(tags__overlap=tags)
        return queryset