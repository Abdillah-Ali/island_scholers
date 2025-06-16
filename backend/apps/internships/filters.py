import django_filters
from .models import Internship

class InternshipFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(lookup_expr='icontains')
    is_remote = django_filters.BooleanFilter()
    duration = django_filters.ChoiceFilter(choices=Internship.DURATION_CHOICES)
    skills_required = django_filters.CharFilter(method='filter_skills')
    stipend_min = django_filters.NumberFilter(field_name='stipend_amount', lookup_expr='gte')
    stipend_max = django_filters.NumberFilter(field_name='stipend_amount', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='application_deadline', lookup_expr='gte')
    
    class Meta:
        model = Internship
        fields = ['location', 'is_remote', 'duration', 'skills_required']
    
    def filter_skills(self, queryset, name, value):
        if value:
            skills = [skill.strip() for skill in value.split(',')]
            return queryset.filter(skills_required__overlap=skills)
        return queryset