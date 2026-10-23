import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';

describe('GenresService', () => {
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenresService],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('still has every genre we already have', () => {
    expect(service.findAll().map((g) => g.slug)).toEqual(
      expect.arrayContaining([
        'action',
        'rpg',
        'shooter',
        'sports',
        'racing',
        'strategy',
        'horror',
        'family',
      ]),
    );
  });

  it('has no duplicate genres', () => {
    const slugs = service.findAll().map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every genre the fields the frontend needs', () => {
    for (const genre of service.findAll()) {
      expect(genre).toEqual({
        slug: expect.any(String),
        name: expect.any(String),
        emoji: expect.any(String),
      });
    }
  });
});
