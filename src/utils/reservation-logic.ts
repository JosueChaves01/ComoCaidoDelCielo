/**
 * Reservation Business Logic
 * Extracted for testability and maintainability.
 */

export interface BusinessRules {
  adult_price: number;
  child_price: number;
  opening_time: string;
  closing_time: string;
  working_days: string[];
}

export interface Terrace {
  id: string;
  title: string;
  max_capacity: number;
  image_url?: string;
  highlight?: string;
}

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/**
 * Validates a Costa Rican phone number (8 digits)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\d{4})[- ]?(\d{4})$|^(\d{8})$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Calculates the total reservation amount
 */
export const calculateTotalAmount = (
  adultsCount: number, 
  childrenCount: number, 
  rules: BusinessRules | null
): number => {
  if (!rules) return 0;
  return (adultsCount * rules.adult_price) + (childrenCount * rules.child_price);
};

/**
 * Checks if a specific date is a working day based on business rules
 */
export const isWorkingDay = (dateStr: string, rules: BusinessRules | null): boolean => {
  if (!rules) return true;
  // Force local midday to avoid timezone shifts during Date parsing
  const date = new Date(dateStr + 'T12:00:00');
  const dayName = DAYS_OF_WEEK[date.getDay()];
  return rules.working_days.includes(dayName);
};

/**
 * Filters terraces based on availability and guest capacity
 */
export const filterAvailableTerraces = (
  allTerraces: Terrace[],
  bookedTerraceIds: string[],
  totalPeople: number
): Terrace[] => {
  return allTerraces.filter(t => 
    !bookedTerraceIds.includes(t.id) && 
    t.max_capacity >= totalPeople
  );
};
