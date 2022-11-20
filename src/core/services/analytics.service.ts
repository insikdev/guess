import { getAnalytics, logEvent } from 'firebase/analytics';

class AnalyticsService {
  logEvent(eventName: 'game_start' | 'game_fail' | 'game_win') {
    if (import.meta.env.PROD) {
      logEvent(getAnalytics(), eventName);
    }
  }
}

export const analyticsService = new AnalyticsService();
