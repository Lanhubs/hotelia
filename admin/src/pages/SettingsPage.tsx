import React, { useState, useEffect } from 'react';
import { SettingsPageHeader } from '../components/settings/SettingsPageHeader';
import { SettingsSidebar, SettingsSectionId } from '../components/settings/SettingsSidebar';
import { PropertyProfileSection } from '../components/settings/PropertyProfileSection';
import { OperationalTimingsSection } from '../components/settings/OperationalTimingsSection';
import { BillingTaxSection } from '../components/settings/BillingTaxSection';
import { KeycardHardwareSection } from '../components/settings/KeycardHardwareSection';
import { NotificationsAutomationSection } from '../components/settings/NotificationsAutomationSection';
import { GatewaysIntegrationsSection } from '../components/settings/GatewaysIntegrationsSection';
import { StaffCredentialsSection } from '../components/settings/StaffCredentialsSection';
import { SaveSettingsBar } from '../components/settings/SaveSettingsBar';
import { useNotificationStore } from '../stores/notificationStore';
import { useSettingsApi, HotelSettingsData } from '../hooks/useSettingsApi';

export const SettingsPage: React.FC = () => {
  const { settings, isLoading, isSaving, updateSettings } = useSettingsApi();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [formState, setFormState] = useState<Partial<HotelSettingsData>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleFieldChange = (fields: Partial<HotelSettingsData>) => {
    setFormState((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formState);
      setSaved(true);
      useNotificationStore.getState().push({
        type: 'system',
        severity: 'success',
        title: 'Property settings saved & synchronized',
        message: `Updated settings for ${formState.propertyName || 'KeoExperience Luxury Hotel'} across cluster.`,
        meta: 'CONFIG',
        source: 'action',
        navigateTo: '/admin/settings',
      });
      setTimeout(() => setSaved(false), 2500);
    } catch {
      useNotificationStore.getState().push({
        type: 'system',
        severity: 'error',
        title: 'Failed to update settings',
        message: 'Could not connect to Hono API server.',
        meta: 'ERROR',
        source: 'action',
      });
    }
  };

  const handleReset = () => {
    if (settings) setFormState(settings);
  };

  return (
    <div className="space-y-6 pb-10 font-sans text-zinc-900">
      <SettingsPageHeader />

      {isLoading && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Retrieving property configuration from server...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        <SettingsSidebar active={activeSection} onSelect={setActiveSection} />

        <form onSubmit={handleSave} className="space-y-5 min-w-0">
          {activeSection === 'general' && (
            <PropertyProfileSection settings={formState} onChange={handleFieldChange} />
          )}

          {activeSection === 'timings' && (
            <OperationalTimingsSection
              checkInTime={formState.checkInTime || '15:00'}
              onCheckInTimeChange={(val) => handleFieldChange({ checkInTime: val })}
              checkOutTime={formState.checkOutTime || '11:00'}
              onCheckOutTimeChange={(val) => handleFieldChange({ checkOutTime: val })}
            />
          )}

          {activeSection === 'billing' && (
            <BillingTaxSection
              currency={formState.baseCurrency || 'USD ($)'}
              onCurrencyChange={(val) => handleFieldChange({ baseCurrency: val })}
            />
          )}

          {activeSection === 'hardware' && (
            <KeycardHardwareSection settings={formState} onChange={handleFieldChange} />
          )}

          {activeSection === 'automation' && (
            <NotificationsAutomationSection settings={formState} onChange={handleFieldChange} />
          )}

          {activeSection === 'gateways' && (
            <GatewaysIntegrationsSection settings={formState} onChange={handleFieldChange} />
          )}

          {activeSection === 'staff' && (
            <StaffCredentialsSection />
          )}

          {activeSection !== 'staff' && (
            <SaveSettingsBar saved={saved || isSaving} onReset={handleReset} />
          )}
        </form>
      </div>
    </div>
  );
};