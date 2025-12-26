export interface Trip {
    tripId: number;
    companyName: string;
    companyLogoUrl: string;
    price: number;
    busTypeName: string;        // VIP, Standard...

    // بيانات المغادرة
    sourceCityName: string;     // Cairo
    sourceStationName: string;  // Tahrir
    tripDate: string;           // 2025-12-22T00...
    departureTime: string;      // 08:00:00

    // بيانات الوصول
    destinationCityName: string; // Alexandria
    destinationStationName: string; // Moharam Bek
    arrivalTime: string;         // 11:30:00
    duration?: string;           // جعلناها اختيارية تحسباً
    currency: string;        // عملة السعر',

    type?: string;             // نوع الرحلة (اختياري)
    // المرافق
    amenities?: string[];        // جعلناها اختيارية
    bookingUrl: string;
}