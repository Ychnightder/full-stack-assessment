import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import { InfrastructureService } from './infrastructure.service';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('InfrastructureService', () => {
  let service: InfrastructureService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new InfrastructureService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getBridges returns data on success', async () => {
    const data = [{ id: 'b1', name: 'Bridge 1' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data });
    const res = await service.getBridges();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(res).toEqual(data);
  });

  it('getBridges returns [] on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('network'));
    const res = await service.getBridges();
    expect(res).toEqual([]);
  });

  it('createBridge posts payload and returns backend data', async () => {
    const payload = { name: 'New', lat: 0, lng: 0 } as any;
    const backend = { id: 'b2', ...payload };
    mockedAxios.post = vi.fn().mockResolvedValue({ data: backend });
    const res = await service.createBridge(payload);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/?$/),
      payload,
      expect.any(Object),
    );
    expect(res).toEqual(backend);
  });

  it('createBridge returns null on axios error', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue({ isAxiosError: true, response: { data: 'bad' } });
    const res = await service.createBridge({} as any);
    expect(res).toBeNull();
  });

  it('deleteBridge calls DELETE and returns data', async () => {
    const backend = { ok: true };
    mockedAxios.delete = vi.fn().mockResolvedValue({ data: backend });
    const res = await service.deleteBridge('id-1');
    expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining('id-1/'));
    expect(res).toEqual(backend);
  });

  it('updateBridge calls PUT and returns data', async () => {
    const backend = { id: 'id-1', name: 'upd' };
    mockedAxios.put = vi.fn().mockResolvedValue({ data: backend });
    const res = await service.updateBridge('id-1', { name: 'upd' } as any);
    expect(mockedAxios.put).toHaveBeenCalledWith(expect.stringContaining('id-1/'), { name: 'upd' });
    expect(res).toEqual(backend);
  });

  it('getSingleBridge returns data', async () => {
    const backend = { id: 'id-1' };
    mockedAxios.get = vi.fn().mockResolvedValue({ data: backend });
    const res = await service.getSingleBridge('id-1');
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('id-1/'));
    expect(res).toEqual(backend);
  });

  it('getSingleBridge returns null on error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('network'));
    const res = await service.getSingleBridge('id-1');
    expect(res).toBeNull();
  });
});
