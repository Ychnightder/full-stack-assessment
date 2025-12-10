import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import { HydrometryService } from './hydrometry.service';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe('HydrometryService', () => {
  let service: HydrometryService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new HydrometryService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getStationById returns first station', async () => {
    const station = { code_station: 'ST-001' };
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { data: [station] } });
    const res = await service.getStationById('ST-001');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('stations/?code_station=ST-001'),
    );
    expect(res).toEqual(station);
  });

  it('getStationById returns null when empty', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { data: [] } });
    const res = await service.getStationById('ST-404');
    expect(res).toBeNull();
  });

  it('getStationById returns null on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('network'));
    const res = await service.getStationById('ST-ERR');
    expect(res).toBeNull();
  });

  it('getStationsByDepartement returns data', async () => {
    const stations = [{ code_station: 'A' }, { code_station: 'B' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { data: stations } });
    const res = await service.getStationsByDepartement();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('stations?code_departement='),
    );
    expect(res).toEqual(stations);
  });

  it('getStationsByDepartement returns [] on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('fail'));
    const res = await service.getStationsByDepartement();
    expect(res).toEqual([]);
  });

  it('getObservationsByStationTr builds URL and returns data', async () => {
    const obs = [{ code_entite: 'ST-001', grandeur_hydro: 'H' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { data: obs } });
    const res = await service.getObservationsByStationTr('ST-001', {
      grandeur: 'H',
      size: 10,
      sort: 'asc',
      fields: 'date_obs',
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/observations_tr\?code_entite=ST-001/),
    );
    expect(res).toEqual(obs);
  });

  it('getObservationsByStationTr returns [] on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('network'));
    const res = await service.getObservationsByStationTr('ST-ERR');
    expect(res).toEqual([]);
  });

  it('getObservationsByStationElab builds URL and returns data', async () => {
    const obs = [{ code_entite: 'ST-001', grandeur_hydro_elab: 'HIXM' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { data: obs } });
    const res = await service.getObservationsByStationElab('ST-001', {
      grandeur: 'HIXM',
      size: 5,
      sort: 'desc',
      fields: 'date_obs_elab',
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/obs_elab\?code_entite=ST-001/),
    );
    expect(res).toEqual(obs);
  });

  it('getObservationsByStationElab returns [] on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('network'));
    const res = await service.getObservationsByStationElab('ST-ERR');
    expect(res).toEqual([]);
  });
});
