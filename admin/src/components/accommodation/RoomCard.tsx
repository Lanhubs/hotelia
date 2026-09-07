import React from 'react';
import { AccommodationRoom } from '../../data/accommodationData';
import { RoomCardListView } from './RoomCardListView';
import { RoomCardGridView } from './RoomCardGridView';

interface RoomCardProps {
  room: AccommodationRoom;
  displayCurrency: 'USD' | 'NGN';
  viewMode?: 'grid' | 'list';
  onQuickWalkIn?: (room: AccommodationRoom) => void;
  onEdit?: (room: AccommodationRoom) => void;
  onDelete?: (room: AccommodationRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  displayCurrency,
  viewMode = 'grid',
  onQuickWalkIn,
  onEdit,
  onDelete,
}) => {
  if (viewMode === 'list') {
    return (
      <RoomCardListView
        room={room}
        displayCurrency={displayCurrency}
        onQuickWalkIn={onQuickWalkIn}
      />
    );
  }

  return (
    <RoomCardGridView
      room={room}
      displayCurrency={displayCurrency}
      onQuickWalkIn={onQuickWalkIn}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
