import { Injectable } from '@nestjs/common';

export interface Genre {
  slug: string;
  name: string;
  emoji: string;
}

@Injectable()
export class GenresService {
  private readonly genres: Genre[] = [
    { slug: 'action', name: 'Action & Adventure', emoji: '⚔️' },
    { slug: 'rpg', name: 'RPG', emoji: '🐉' },
    { slug: 'shooter', name: 'Shooters', emoji: '🎯' },
    { slug: 'sports', name: 'Sports', emoji: '⚽' },
    { slug: 'racing', name: 'Racing', emoji: '🏎️' },
    { slug: 'strategy', name: 'Strategy', emoji: '🏰' },
    { slug: 'horror', name: 'Horror', emoji: '👻' },
    { slug: 'family', name: 'Family & Co-op', emoji: '🧩' },
  ];

  findAll(): Genre[] {
    return this.genres;
  }
}
