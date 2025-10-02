"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Settings } from "lucide-react";

export type DisplaySettings = {
  fontSize: number;
  opacity: number;
  backgroundColor: string;
  textColor: string;
};

type SettingsPanelProps = {
  settings: DisplaySettings;
  onSettingsChange: (settings: Partial<DisplaySettings>) => void;
};

const backgroundOptions = [
  { id: 'dark', name: 'Dark', value: '26, 0, 51', textColor: '240, 240, 240'},
  { id: 'light', name: 'Light', value: '240, 240, 240', textColor: '10, 10, 10'},
];

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Display Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
          <Slider
            id="font-size"
            min={12}
            max={48}
            step={1}
            value={[settings.fontSize]}
            onValueChange={([value]) => onSettingsChange({ fontSize: value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opacity">Background Opacity: {settings.opacity}%</Label>
          <Slider
            id="opacity"
            min={0}
            max={100}
            step={5}
            value={[settings.opacity]}
            onValueChange={([value]) => onSettingsChange({ opacity: value })}
          />
        </div>
        <div className="space-y-3">
            <Label>Theme</Label>
            <RadioGroup 
                defaultValue={backgroundOptions.find(opt => opt.value === settings.backgroundColor)?.id || 'dark'}
                onValueChange={(id) => {
                    const selected = backgroundOptions.find(opt => opt.id === id);
                    if(selected) {
                        onSettingsChange({ backgroundColor: selected.value, textColor: selected.textColor })
                    }
                }}
            >
                {backgroundOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.name}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
