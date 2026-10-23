import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlatformsService } from './platforms.service';

describe('PlatformsService', () => {
  let service: PlatformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformsService],
    }).compile();

    service = module.get<PlatformsService>(PlatformsService);
  });

  it('still has every platform we already sell', () => {
    expect(service.findAll().map((p) => p.slug)).toEqual(
      expect.arrayContaining(['ps5', 'xbox', 'pc']),
    );
  });

  it('has no duplicate platforms', () => {
    const slugs = service.findAll().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every platform the fields the frontend needs', () => {
    for (const platform of service.findAll()) {
      expect(platform).toEqual({
        slug: expect.any(String),
        name: expect.any(String),
        shortName: expect.any(String),
        emoji: expect.any(String),
        hue: expect.any(Number),
      });
    }
  });

  it.each(['ps5', 'xbox', 'pc'])(
    'findOne(%s) returns that platform',
    (slug) => {
      expect(service.findOne(slug).slug).toBe(slug);
    },
  );

  it.each(['nope', 'PS5', '', 'ps', 'ps5x', ' ps5'])(
    'findOne(%s) throws NotFoundException',
    (slug) => {
      expect(() => service.findOne(slug)).toThrow(NotFoundException);
    },
  );
});
