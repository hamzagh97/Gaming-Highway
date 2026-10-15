import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export type PlatformSlug = 'ps5' | 'xbox' | 'pc';

export interface Platform {
  slug: PlatformSlug;
  /** Full name, e.g. "PlayStation 5". */
  name: string;
  /** Badge label, e.g. "PS5". */
  shortName: string;
  emoji: string;
  hue: number;
}

@Injectable()
export class PlatformsService {
  private readonly platforms: Platform[] = [
    {
      slug: 'ps5',
      name: 'PlayStation 5',
      shortName: 'PS5',
      emoji: '🎮',
      hue: 215,
    },
    {
      slug: 'xbox',
      name: 'Xbox Series X|S',
      shortName: 'Xbox',
      emoji: '🕹️',
      hue: 135,
    },
    { slug: 'pc', name: 'PC', shortName: 'PC', emoji: '🖥️', hue: 175 },
  ];

  findAll(): Platform[] {
    return this.platforms;
  }

  findOne(slug: string): Platform {
    const platform = this.platforms.find((p) => p.slug === slug);
    if (!platform) {
      throw new NotFoundException(`Platform "${slug}" not found`);
    }
    return platform;
  }
}
