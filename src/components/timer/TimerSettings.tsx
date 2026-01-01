import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Clock, Volume2, Monitor, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  TimerSettings as TimerSettingsType, 
  TimerPosition, 
  TimerSize, 
  AlertTiming, 
  RiskAlertTiming, 
  VolumeLevel,
  TimerFormat 
} from '@/types/timer';
import { toast } from 'sonner';

interface TimerSettingsProps {
  settings: TimerSettingsType;
  onUpdateSetting: <K extends keyof TimerSettingsType>(key: K, value: TimerSettingsType[K]) => void;
  onSave: () => boolean;
  onReset: () => boolean;
}

export function TimerSettings({ settings, onUpdateSetting, onSave, onReset }: TimerSettingsProps) {
  const handleSave = () => {
    const success = onSave();
    if (success) {
      toast.success('Settings saved!', { icon: <Save className="w-4 h-4 text-emerald" /> });
    } else {
      toast.error('Failed to save settings');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      const success = onReset();
      if (success) {
        toast.success('Settings reset to defaults');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Timer Display Options */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl bg-potblack-light border border-emerald/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald" />
          <h3 className="font-display text-base font-bold text-white">Timer Display</h3>
        </div>

        <div className="space-y-4">
          {/* Toggle: Show Floating Timer */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Show Floating Timer Bubble</Label>
            <Switch
              checked={settings.showFloatingTimer}
              onCheckedChange={(checked) => onUpdateSetting('showFloatingTimer', checked)}
              className="data-[state=checked]:bg-emerald"
            />
          </div>

          {settings.showFloatingTimer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pl-4 border-l-2 border-emerald/20"
            >
              {/* Timer Position */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-light">Timer Position</Label>
                <Select
                  value={settings.timerPosition}
                  onValueChange={(value: TimerPosition) => onUpdateSetting('timerPosition', value)}
                >
                  <SelectTrigger className="bg-potblack border-emerald/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-potblack border-emerald/30">
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timer Size */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-light">Timer Size</Label>
                <Select
                  value={settings.timerSize}
                  onValueChange={(value: TimerSize) => onUpdateSetting('timerSize', value)}
                >
                  <SelectTrigger className="bg-potblack border-emerald/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-potblack border-emerald/30">
                    <SelectItem value="small">Small (240px)</SelectItem>
                    <SelectItem value="medium">Medium (280px)</SelectItem>
                    <SelectItem value="large">Large (320px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timer Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-light">Timer Opacity</Label>
                  <span className="text-sm text-emerald">{settings.timerOpacity}%</span>
                </div>
                <Slider
                  value={[settings.timerOpacity]}
                  onValueChange={([value]) => onUpdateSetting('timerOpacity', value)}
                  min={50}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:bg-emerald"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Section 2: Notification Settings */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-potblack-light border border-pheromone/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-pheromone" />
          <h3 className="font-display text-base font-bold text-white">Notifications</h3>
        </div>

        <div className="space-y-4">
          {/* Quest Deadline Alerts */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Quest Deadline Alerts</Label>
            <Switch
              checked={settings.questDeadlineAlerts}
              onCheckedChange={(checked) => onUpdateSetting('questDeadlineAlerts', checked)}
              className="data-[state=checked]:bg-pheromone"
            />
          </div>

          {settings.questDeadlineAlerts && (
            <div className="pl-4 border-l-2 border-pheromone/20">
              <Label className="text-sm text-gray-light">Alert Timing</Label>
              <Select
                value={settings.alertTiming}
                onValueChange={(value: AlertTiming) => onUpdateSetting('alertTiming', value)}
              >
                <SelectTrigger className="mt-2 bg-potblack border-pheromone/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-potblack border-pheromone/30">
                  <SelectItem value="1hour">1 hour before</SelectItem>
                  <SelectItem value="30min">30 minutes before</SelectItem>
                  <SelectItem value="10min">10 minutes before</SelectItem>
                  <SelectItem value="5min">5 minutes before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Daily Check-In Reminder */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Daily Check-In Reminder</Label>
            <Switch
              checked={settings.dailyCheckInReminder}
              onCheckedChange={(checked) => onUpdateSetting('dailyCheckInReminder', checked)}
              className="data-[state=checked]:bg-pheromone"
            />
          </div>

          {settings.dailyCheckInReminder && (
            <div className="pl-4 border-l-2 border-pheromone/20">
              <Label className="text-sm text-gray-light">Preferred Time</Label>
              <input
                type="time"
                value={settings.preferredTime}
                onChange={(e) => onUpdateSetting('preferredTime', e.target.value)}
                min="09:00"
                max="22:00"
                className="mt-2 w-full px-3 py-2 rounded-md bg-potblack border border-pheromone/30 text-white text-sm"
              />
            </div>
          )}

          {/* Streak Maintenance Alert */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Streak Maintenance Alert</Label>
            <Switch
              checked={settings.streakMaintenanceAlert}
              onCheckedChange={(checked) => onUpdateSetting('streakMaintenanceAlert', checked)}
              className="data-[state=checked]:bg-pheromone"
            />
          </div>

          {settings.streakMaintenanceAlert && (
            <div className="pl-4 border-l-2 border-pheromone/20">
              <Label className="text-sm text-gray-light">Alert When At Risk</Label>
              <Select
                value={settings.riskAlertTiming}
                onValueChange={(value: RiskAlertTiming) => onUpdateSetting('riskAlertTiming', value)}
              >
                <SelectTrigger className="mt-2 bg-potblack border-pheromone/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-potblack border-pheromone/30">
                  <SelectItem value="12hours">12 hours before midnight</SelectItem>
                  <SelectItem value="6hours">6 hours before midnight</SelectItem>
                  <SelectItem value="1hour">1 hour before midnight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </motion.section>

      {/* Section 3: Display Preference */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-xl bg-potblack-light border border-emerald/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-emerald" />
          <h3 className="font-display text-base font-bold text-white">Display Preference</h3>
        </div>

        <RadioGroup
          value={settings.timerFormat}
          onValueChange={(value: TimerFormat) => onUpdateSetting('timerFormat', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-potblack border border-emerald/20 cursor-pointer hover:border-emerald/40 transition-colors">
            <RadioGroupItem value="remaining" id="remaining" className="border-emerald text-emerald" />
            <Label htmlFor="remaining" className="cursor-pointer flex-1">
              <span className="text-sm text-white">Remaining Time</span>
              <p className="text-xs text-gray-light mt-1">Show 'Quest ends in HH:MM:SS'</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-potblack border border-emerald/20 cursor-pointer hover:border-emerald/40 transition-colors">
            <RadioGroupItem value="elapsed" id="elapsed" className="border-emerald text-emerald" />
            <Label htmlFor="elapsed" className="cursor-pointer flex-1">
              <span className="text-sm text-white">Elapsed Time</span>
              <p className="text-xs text-gray-light mt-1">Show 'Active for Xh XXm'</p>
            </Label>
          </div>
        </RadioGroup>
      </motion.section>

      {/* Section 4: Advanced Options */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-xl bg-potblack-light border border-gold/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-gold" />
          <h3 className="font-display text-base font-bold text-white">Advanced Options</h3>
        </div>

        <div className="space-y-4">
          {/* Sound Notifications */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Sound Notifications</Label>
            <Switch
              checked={settings.soundNotifications}
              onCheckedChange={(checked) => onUpdateSetting('soundNotifications', checked)}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {settings.soundNotifications && (
            <div className="pl-4 border-l-2 border-gold/20">
              <Label className="text-sm text-gray-light">Volume</Label>
              <Select
                value={settings.volumeLevel}
                onValueChange={(value: VolumeLevel) => onUpdateSetting('volumeLevel', value)}
              >
                <SelectTrigger className="mt-2 bg-potblack border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-potblack border-gold/30">
                  <SelectItem value="mute">Mute</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Bar Icon */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Status Bar Icon</Label>
            <Switch
              checked={settings.statusBarIcon}
              onCheckedChange={(checked) => onUpdateSetting('statusBarIcon', checked)}
              className="data-[state=checked]:bg-gold"
            />
          </div>
        </div>
      </motion.section>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-4"
      >
        <button
          onClick={handleReset}
          className="text-xs text-gray-dark hover:text-gray-light transition-colors"
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          Reset to Defaults
        </button>

        <Button
          onClick={handleSave}
          className="bg-emerald hover:bg-emerald/80 text-potblack font-display text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}
