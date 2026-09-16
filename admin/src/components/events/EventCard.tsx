import React from 'react';
import { EventCardGridView } from './EventCardGridView';
import { EventCardListView } from './EventCardListView';
import type { Event } from '../../stores/eventsStore';

interface EventCardProps {
  event: Event;
  displayCurrency: 'USD' | 'NGN';
  viewMode?: 'grid' | 'list';
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onViewBookings?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  displayCurrency,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onViewBookings,
}) => {
  if (viewMode === 'list') {
    return (
      <EventCardListView
        event={event}
        displayCurrency={displayCurrency}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewBookings={onViewBookings}
      />
    );
  }

  return (
    <EventCardGridView
      event={event}
      displayCurrency={displayCurrency}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewBookings={onViewBookings}
    />
  );
};