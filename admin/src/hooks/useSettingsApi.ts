import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

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

export function useSettingsApi() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['hotelSettings'],
    queryFn: () => Api.get<HotelSettingsData>('/admin/settings'),
  });

  const updateMutation = useMutation({
    mutationFn: (newSettings: Partial<HotelSettingsData>) =>
      Api.post<{ success: boolean; settings: HotelSettingsData }>('/admin/settings', newSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(['hotelSettings'], data.settings);
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isSaving: updateMutation.isPending,
    updateSettings: updateMutation.mutateAsync,
    refetch: settingsQuery.refetch,
  };
}
