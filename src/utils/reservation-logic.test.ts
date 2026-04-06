import { describe, it, expect } from 'vitest';
import { 
  validatePhone, 
  calculateTotalAmount, 
  isWorkingDay, 
  filterAvailableTerraces,
  BusinessRules,
  Terrace
} from './reservation-logic';

describe('Reservation Logic Utils', () => {

  describe('validatePhone', () => {
    it('should validate 8 digit phone numbers correctly', () => {
      expect(validatePhone('88887777')).toBe(true);
      expect(validatePhone(' 88887777 ')).toBe(true);
    });

    it('should validate 8 digit numbers with dashes or spaces', () => {
      expect(validatePhone('8888-7777')).toBe(true);
      expect(validatePhone('8888 7777')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('888877771')).toBe(false); // 9 digits
      expect(validatePhone('abcdefgh')).toBe(false);
    });
  });

  describe('calculateTotalAmount', () => {
    const mockRules: BusinessRules = {
      adult_price: 10,
      child_price: 5,
      opening_time: '10:00',
      closing_time: '22:00',
      working_days: []
    };

    it('should calculate correctly for adults and children', () => {
      expect(calculateTotalAmount(2, 2, mockRules)).toBe(30);
      expect(calculateTotalAmount(1, 0, mockRules)).toBe(10);
      expect(calculateTotalAmount(0, 1, mockRules)).toBe(5);
    });

    it('should return 0 if no rules provided', () => {
      expect(calculateTotalAmount(2, 2, null)).toBe(0);
    });
  });

  describe('isWorkingDay', () => {
    const mockRules: BusinessRules = {
      adult_price: 0,
      child_price: 0,
      opening_time: '',
      closing_time: '',
      working_days: ['Lunes', 'Martes', 'Miércoles']
    };

    it('should return true if day is in working_days', () => {
      // 2026-04-06 is a Monday (Lunes)
      expect(isWorkingDay('2026-04-06', mockRules)).toBe(true);
    });

    it('should return false if day is NOT in working_days', () => {
      // 2026-04-05 is a Sunday (Domingo)
      expect(isWorkingDay('2026-04-05', mockRules)).toBe(false);
    });
  });

  describe('filterAvailableTerraces', () => {
    const terraces: Terrace[] = [
      { id: '1', title: 'T1', max_capacity: 4 },
      { id: '2', title: 'T2', max_capacity: 8 },
      { id: '3', title: 'T3', max_capacity: 2 }
    ];

    it('should filter out booked terraces', () => {
      const booked = ['1'];
      const filtered = filterAvailableTerraces(terraces, booked, 1);
      expect(filtered.length).toBe(2);
      expect(filtered.find(t => t.id === '1')).toBe(undefined);
    });

    it('should filter based on capacity', () => {
      const filtered = filterAvailableTerraces(terraces, [], 5);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('2'); // Only T2 has capacity for 5+
    });
  });

});
