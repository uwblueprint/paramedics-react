import { useMutation } from '@apollo/react-hooks';
import { ADD_EVENT } from '../templates/events';

export function useEventMutation(
  {
    name,
    eventDate,
    createdBy,
    isActive,
  }: {
    name: string;
    eventDate: Date;
    createdBy: number;
    isActive: boolean;
  },
  complete: boolean,
  setComplete: (val: boolean) => any
) {
  const [addEvent] = useMutation(ADD_EVENT);
  const dateParts: {
    year?: string;
    month?: string;
    day?: string;
    literal?: string;
  } = new Intl.DateTimeFormat().formatToParts(eventDate).reduce(
    (obj, currentPart) => ({
      ...obj,
      [currentPart.type]: currentPart.value,
    }),
    {}
  );

  if (complete) {
    addEvent({
      variables: {
        name,
        eventDate:
          dateParts.year &&
          dateParts.month &&
          dateParts.day &&
          `${dateParts.year}-${dateParts.month.padStart(
            2,
            '0'
          )}-${dateParts.day.padStart(2, '0')}`,
        createdBy,
        isActive,
      },
    });
    setComplete(false);
  }
}
