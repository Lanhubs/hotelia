import { getDatabase } from "../database";

export interface HotelSettingsData {
  propertyName: string;
  starRating: number;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  checkInTime: string;
  checkOutTime: string;
  gracePeriodMins: number;
  earlyCheckInFeePct: number;
  lateCheckOutFeeHr: number;
  autoReleaseUnpaidHrs: number;
  baseCurrency: string;
  currencyMultiplier: number;
  vatTaxRatePct: number;
  serviceChargePct: number;
  tourismLevyPerNight: number;
  autoInvoiceReceipts: boolean;
  keycardFrequency: string;
  keycardExpirationPaddingHrs: number;
  keycardAutoInvalidate: boolean;
  encoderIpPort: string;
  enableSmsWelcome: boolean;
  enableEmailFolio: boolean;
  lowInventoryThreshold: number;
  nightAuditAutoTime: string;
  paystackPublicKey: string;
  stripePublicKey: string;
  otaChannelManagerToken: string;
}

let inMemorySettingsCache: HotelSettingsData = {
  propertyName: 'KeoExperience Luxury Hotel & Suites',
  starRating: 5,
  tagline: 'Luxury oceanfront sanctuary with infinity plunge suites',
  address: 'Plot 1421, Victoria Island Promenade, Lagos, Nigeria',
  phone: '+234 1 890 2341',
  email: 'reception@KeoExperience.luxury',
  licenseNumber: 'HOTEL-LIC-2026-9021',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  gracePeriodMins: 30,
  earlyCheckInFeePct: 25,
  lateCheckOutFeeHr: 50,
  autoReleaseUnpaidHrs: 2,
  baseCurrency: 'USD ($)',
  currencyMultiplier: 1600,
  vatTaxRatePct: 7.5,
  serviceChargePct: 10,
  tourismLevyPerNight: 5,
  autoInvoiceReceipts: true,
  keycardFrequency: '13.56MHz (Mifare Classic / DESFire)',
  keycardExpirationPaddingHrs: 2,
  keycardAutoInvalidate: true,
  encoderIpPort: '192.168.1.150:8080',
  enableSmsWelcome: true,
  enableEmailFolio: true,
  lowInventoryThreshold: 15,
  nightAuditAutoTime: '02:00',
  paystackPublicKey: process.env.PAYSTACK_KEY!,
  stripePublicKey: 'pk_live_51M092184019284102941',
  otaChannelManagerToken: 'TOKEN-OTA-SYNC-9021',
};

class SettingsRepository {
  async getSettings(): Promise<HotelSettingsData> {
    try {
      const db = getDatabase();
      const row = await db.queryOne<any>('SELECT * FROM hotel_settings WHERE id = \'default\'');
      if (row) {
        return {
          propertyName: row.property_name || inMemorySettingsCache.propertyName,
          starRating: row.star_rating || inMemorySettingsCache.starRating,
          tagline: row.tagline || inMemorySettingsCache.tagline,
          address: row.address || inMemorySettingsCache.address,
          phone: row.phone || inMemorySettingsCache.phone,
          email: row.email || inMemorySettingsCache.email,
          licenseNumber: row.license_number || inMemorySettingsCache.licenseNumber,
          checkInTime: row.check_in_time || inMemorySettingsCache.checkInTime,
          checkOutTime: row.check_out_time || inMemorySettingsCache.checkOutTime,
          gracePeriodMins: row.grace_period_mins || inMemorySettingsCache.gracePeriodMins,
          earlyCheckInFeePct: row.early_check_in_fee_pct || inMemorySettingsCache.earlyCheckInFeePct,
          lateCheckOutFeeHr: row.late_check_out_fee_hr || inMemorySettingsCache.lateCheckOutFeeHr,
          autoReleaseUnpaidHrs: row.auto_release_unpaid_hrs || inMemorySettingsCache.autoReleaseUnpaidHrs,
          baseCurrency: row.base_currency || inMemorySettingsCache.baseCurrency,
          currencyMultiplier: row.currency_multiplier || inMemorySettingsCache.currencyMultiplier,
          vatTaxRatePct: row.vat_tax_rate_pct || inMemorySettingsCache.vatTaxRatePct,
          serviceChargePct: row.service_charge_pct || inMemorySettingsCache.serviceChargePct,
          tourismLevyPerNight: row.tourism_levy_per_night || inMemorySettingsCache.tourismLevyPerNight,
          autoInvoiceReceipts: row.auto_invoice_receipts ?? inMemorySettingsCache.autoInvoiceReceipts,
          keycardFrequency: row.keycard_frequency || inMemorySettingsCache.keycardFrequency,
          keycardExpirationPaddingHrs: row.keycard_expiration_padding_hrs || inMemorySettingsCache.keycardExpirationPaddingHrs,
          keycardAutoInvalidate: row.keycard_auto_invalidate ?? inMemorySettingsCache.keycardAutoInvalidate,
          encoderIpPort: row.encoder_ip_port || inMemorySettingsCache.encoderIpPort,
          enableSmsWelcome: row.enable_sms_welcome ?? inMemorySettingsCache.enableSmsWelcome,
          enableEmailFolio: row.enable_email_folio ?? inMemorySettingsCache.enableEmailFolio,
          lowInventoryThreshold: row.low_inventory_threshold || inMemorySettingsCache.lowInventoryThreshold,
          nightAuditAutoTime: row.night_audit_auto_time || inMemorySettingsCache.nightAuditAutoTime,
          paystackPublicKey: row.paystack_public_key || inMemorySettingsCache.paystackPublicKey,
          stripePublicKey: row.stripe_public_key || inMemorySettingsCache.stripePublicKey,
          otaChannelManagerToken: row.ota_channel_manager_token || inMemorySettingsCache.otaChannelManagerToken,
        };
      }
    } catch (e) {
      // Return cached settings on database query warning
    }
    return inMemorySettingsCache;
  }

  async updateSettings(newSettings: Partial<HotelSettingsData>): Promise<HotelSettingsData> {
    inMemorySettingsCache = { ...inMemorySettingsCache, ...newSettings };
    return inMemorySettingsCache;
  }
}

export default new SettingsRepository();
