import { initialUserData, migrateUserData, STORE_KEY } from './initial';
import { useUserStore } from './user';

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('user store', () => {
  it('persists state to localStorage under oblako:v1', () => {
    useUserStore.getState().toggleFavorite('tbilisi');
    const saved = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(saved.version).toBe(2);
    expect(saved.state.favorites).toEqual(['tbilisi']);
  });

  it('restores state after a reload', async () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ version: 1, state: { ...initialUserData(), favorites: ['sochi'] } }),
    );
    await useUserStore.persist.rehydrate();
    expect(useUserStore.getState().favorites).toEqual(['sochi']);
  });

  it('toggles favorites', () => {
    const { toggleFavorite } = useUserStore.getState();
    toggleFavorite('kazan');
    toggleFavorite('kazan');
    expect(useUserStore.getState().favorites).toEqual([]);
  });

  it('booking puts the pass into the wallet and stamps the passport once per city', () => {
    const { completeBooking } = useUserStore.getState();
    const pass = { id: 'p1', cityId: 'yerevan', seat: '12A', issuedAt: '2026-11-13' };
    completeBooking(pass);
    completeBooking({ ...pass, id: 'p2' });
    const s = useUserStore.getState();
    expect(s.booking.passes).toHaveLength(2);
    expect(s.passport.stamps).toEqual(['yerevan']);
  });

  it('adds gallery places to the route without duplicates', () => {
    const { addToRoute } = useUserStore.getState();
    addToRoute('tbilisi', 'narikala');
    addToRoute('tbilisi', 'narikala');
    expect(useUserStore.getState().routeAdded).toEqual({ tbilisi: ['narikala'] });
  });

  it('resets packing when the city changes', () => {
    const { setPacked } = useUserStore.getState();
    setPacked('sochi', 'swimsuit', true);
    setPacked('altai', 'boots', true);
    expect(useUserStore.getState().packing).toEqual({ cityId: 'altai', packed: { boots: true } });
  });
});

describe('migrateUserData', () => {
  it('migrates v0: favorites map → list, missing sections from defaults', () => {
    const v0 = { favorites: { tbilisi: true, sochi: false }, passport: { stamps: ['tbilisi'] } };
    const data = migrateUserData(v0, 0);
    expect(data.favorites).toEqual(['tbilisi']);
    expect(data.passport).toEqual({ stamps: ['tbilisi'], achievements: [] });
    expect(data.profile.name).toBe('[Имя Фамилия]');
    expect(data.ui.boardSound).toBe(false);
  });

  it('migrates v1 → v2: keeps data, adds an empty budget', () => {
    const v1 = { ...initialUserData(), favorites: ['kazan'] } as Record<string, unknown>;
    delete v1.budget;
    const data = migrateUserData(v1, 1);
    expect(data.favorites).toEqual(['kazan']);
    expect(data.budget).toBeNull();
  });

  it('adds and removes expenses only when a budget exists', () => {
    const { addExpense, removeExpense, setBudget } = useUserStore.getState();
    const e = {
      id: 'e1',
      amount: 10,
      currency: 'GEL',
      rub: 317,
      category: 'food' as const,
      day: 1,
    };
    addExpense(e);
    expect(useUserStore.getState().budget).toBeNull();
    setBudget('tbilisi', 90000, []);
    addExpense(e);
    expect(useUserStore.getState().budget?.expenses).toEqual([e]);
    removeExpense('e1');
    expect(useUserStore.getState().budget?.expenses).toEqual([]);
  });

  it('returns defaults for garbage', () => {
    expect(migrateUserData('oops', 0)).toEqual(initialUserData());
    expect(migrateUserData(null, 1)).toEqual(initialUserData());
  });

  it('rehydrates an old version through migrate', async () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ version: 0, state: { favorites: { altai: true } } }),
    );
    await useUserStore.persist.rehydrate();
    const s = useUserStore.getState();
    expect(s.favorites).toEqual(['altai']);
    expect(s.booking.passes).toEqual([]);
  });
});
