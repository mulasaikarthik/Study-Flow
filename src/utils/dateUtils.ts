// Date utility functions for StudyFlow

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return timeString;
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDays(dateString: string): { label: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } {
  if (!dateString) return { label: 'No date', isOverdue: false, isToday: false, isTomorrow: false };

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)}d overdue`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      isOverdue: false,
      isToday: true,
      isTomorrow: false,
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      isOverdue: false,
      isToday: false,
      isTomorrow: true,
    };
  } else if (diffDays <= 7) {
    return {
      label: `In ${diffDays} days`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  } else {
    return {
      label: formatDate(dateString),
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  }
}

export function isDateInThisWeek(dateString: string): boolean {
  if (!dateString) return false;
  const target = new Date(dateString);
  const now = new Date();
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return target >= startOfWeek && target < endOfWeek;
}

export function getOffsetDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
