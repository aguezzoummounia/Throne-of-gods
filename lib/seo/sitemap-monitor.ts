import { quizData } from "../data";
import type { VillainKey } from "../types";
import { generateSitemapUrls, getSitemapStats } from "./sitemap";

/**
 * Interface for sitemap change detection
 */
export interface SitemapChange {
  type: "added" | "removed" | "modified";
  url: string;
  timestamp: Date;
  reason?: string;
}

/**
 * Monitor sitemap changes based on data updates
 */
export class SitemapMonitor {
  private lastKnownCharacters: Set<VillainKey>;
  private lastUpdate: Date;

  constructor() {
    this.lastKnownCharacters = new Set(
      Object.keys(quizData.villains) as VillainKey[]
    );
    this.lastUpdate = new Date();
  }

  /**
   * Check for changes in the data that would affect the sitemap
   */
  detectChanges(): SitemapChange[] {
    const changes: SitemapChange[] = [];
    const currentCharacters = new Set(
      Object.keys(quizData.villains) as VillainKey[]
    );
    const now = new Date();

    // Check for new characters
    for (const character of currentCharacters) {
      if (!this.lastKnownCharacters.has(character)) {
        changes.push({
          type: "added",
          url: `/characters/${character}`,
          timestamp: now,
          reason: "New character added to data",
        });

        changes.push({
          type: "added",
          url: `/quiz/results/${character}`,
          timestamp: now,
          reason: "New quiz result page for character",
        });
      }
    }

    // Check for removed characters
    for (const character of this.lastKnownCharacters) {
      if (!currentCharacters.has(character)) {
        changes.push({
          type: "removed",
          url: `/characters/${character}`,
          timestamp: now,
          reason: "Character removed from data",
        });

        changes.push({
          type: "removed",
          url: `/quiz/results/${character}`,
          timestamp: now,
          reason: "Quiz result page removed",
        });
      }
    }

    // Update tracking
    this.lastKnownCharacters = currentCharacters;
    this.lastUpdate = now;

    return changes;
  }

  /**
   * Get sitemap health status
   */
  getHealthStatus() {
    const urls = generateSitemapUrls();
    const stats = getSitemapStats(urls);

    return {
      totalUrls: stats.totalUrls,
      lastUpdate: this.lastUpdate,
      characterCount: this.lastKnownCharacters.size,
      isHealthy: stats.totalUrls > 0,
      stats,
    };
  }

  /**
   * Validate all sitemap URLs are accessible
   */
  async validateUrls(
    baseUrl: string
  ): Promise<{ valid: string[]; invalid: string[] }> {
    const urls = generateSitemapUrls({
      baseUrl,
      defaultChangeFreq: "weekly",
      defaultPriority: 0.5,
    });
    const valid: string[] = [];
    const invalid: string[] = [];

    // In a real implementation, you might want to make HTTP requests to validate
    // For now, we'll do basic validation
    for (const urlData of urls) {
      try {
        new URL(urlData.url);
        valid.push(urlData.url);
      } catch {
        invalid.push(urlData.url);
      }
    }

    return { valid, invalid };
  }
}
