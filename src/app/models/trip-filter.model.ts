export interface TripFilter {
  priceMin: number | null;
  priceMax: number | null;
  companies: string[];  // مصفوفة بأسماء الشركات المختارة
  busType: string[];    // مصفوفة بأنواع الباصات (VIP, Business...)
  amenities: string[];  // مصفوفة بالمميزات (WiFi, WC...)
}