import { isValidSeat, moveSeat, seatInfo, seatLabel, seatPrice, windowView } from './booking';

describe('booking seats', () => {
  it('knows window, aisle, wing and extra legroom', () => {
    expect(seatInfo('8A')).toMatchObject({ window: true, wing: true, extra: false });
    expect(seatInfo('12F')).toMatchObject({ window: true, wing: false, extra: true });
    expect(seatInfo('3C')).toMatchObject({ window: false, aisle: true });
    expect(seatInfo('2A').taken).toBe(true);
  });

  it('validates seats', () => {
    expect(isValidSeat('7A')).toBe(true);
    expect(isValidSeat('2A')).toBe(false);
    expect(isValidSeat('21A')).toBe(false);
    expect(isValidSeat('7G')).toBe(false);
    expect(isValidSeat(null)).toBe(false);
  });

  it('moves with arrows inside the cabin', () => {
    expect(moveSeat('7A', 'ArrowRight')).toBe('8A');
    expect(moveSeat('1A', 'ArrowLeft')).toBeNull();
    expect(moveSeat('7F', 'ArrowDown')).toBe('7E');
    expect(moveSeat('7F', 'ArrowUp')).toBeNull();
    expect(moveSeat('7C', 'ArrowDown')).toBe('7B');
  });

  it('describes the view and the label', () => {
    expect(windowView(seatInfo('9F')).title).toBe('Вид на крыло');
    expect(windowView(seatInfo('3A')).title).toBe('Чистый вид на облака');
    expect(windowView(seatInfo('3B')).title).toBe('Между соседями');
    expect(seatLabel(seatInfo('2B'))).toBe('Место 2B, занято');
  });

  it('charges extra for legroom', () => {
    expect(seatPrice(20000, seatInfo('12B'))).toBe(21500);
    expect(seatPrice(20000, seatInfo('7B'))).toBe(20000);
  });
});
