"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Slider } from "../../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "../../components/ui/use-toast";
import { Download, DownloadCloud, Moon, Save, Sun, Upload } from "lucide-react";
import { useTheme } from "../../components/theme-provider";

// Settings interface for type safety
interface UserSettings {
  defaultEditor: "rich" | "markdown";
  autosaveInterval: number; // in minutes
  fontScale: number;
  enableSpellcheck: boolean;
  showLineNumbers: boolean;
  enableCloudSync: boolean;
  defaultTags: string[];
}

// Default settings
const defaultSettings: UserSettings = {
  defaultEditor: "rich",
  autosaveInterval: 5,
  fontScale: 1,
  enableSpellcheck: true,
  showLineNumbers: true,
  enableCloudSync: false,
  defaultTags: []
};

export default function SettingsPage() {
  // Get theme from provider
  const { theme, setTheme } = useTheme();
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    // In a real app, we would load from localStorage or an API
    return defaultSettings;
  });
  
  // Handle settings changes
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };
  
  // Handle save button
  const saveSettings = () => {
    // In a real app, we would save to localStorage or an API
    console.log("Saving settings:", settings);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };
  
  // Handle export settings
  const exportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "note-taker-settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Settings exported",
      description: "Your settings have been exported to a JSON file."
    });
  };
  
  // Handle import settings
  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonSettings = JSON.parse(event.target?.result as string);
        setSettings({ ...defaultSettings, ...jsonSettings });
        
        toast({
          title: "Settings imported",
          description: "Your settings have been imported successfully."
        });
      } catch (error) {
        console.error("Error importing settings:", error);
        
        toast({
          title: "Import failed",
          description: "There was an error importing your settings.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
      
      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="backup">Backup & Sync</TabsTrigger>
        </TabsList>
        
        {/* Editor Settings */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor Preferences</CardTitle>
              <CardDescription>
                Customize your note-taking experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Editor</Label>
                <RadioGroup
                  value={settings.defaultEditor}
                  onValueChange={(value: string) => updateSettings({ defaultEditor: value as "rich" | "markdown" })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rich" id="rich" />
                    <Label htmlFor="rich">Rich Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="markdown" id="markdown" />
                    <Label htmlFor="markdown">Markdown</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Auto-save Interval (minutes)</Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.autosaveInterval} {settings.autosaveInterval === 1 ? "minute" : "minutes"}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[settings.autosaveInterval]}
                  onValueChange={(value: number[]) => updateSettings({ autosaveInterval: value[0] })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Font Scale</Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.fontScale.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  value={[settings.fontScale]}
                  onValueChange={(value: number[]) => updateSettings({ fontScale: value[0] })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="spellcheck">Enable Spellcheck</Label>
                <Switch
                  id="spellcheck"
                  checked={settings.enableSpellcheck}
                  onCheckedChange={(checked: boolean) => updateSettings({ enableSpellcheck: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="linenumbers">Show Line Numbers (Markdown)</Label>
                <Switch
                  id="linenumbers"
                  checked={settings.showLineNumbers}
                  onCheckedChange={(checked: boolean) => updateSettings({ showLineNumbers: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex gap-2 items-center"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex gap-2 items-center"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex gap-2 items-center"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Backup & Sync Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Sync</CardTitle>
              <CardDescription>
                Manage your data and cloud synchronization settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="cloudsync">Enable Cloud Sync</Label>
                <Switch
                  id="cloudsync"
                  checked={settings.enableCloudSync}
                  onCheckedChange={(checked: boolean) => updateSettings({ enableCloudSync: checked })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Button
                    variant="outline"
                    className="flex gap-2 items-center w-full"
                    onClick={exportSettings}
                  >
                    <Download className="h-4 w-4" />
                    Export Settings
                  </Button>
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      id="import-settings"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={importSettings}
                    />
                    <Button
                      variant="outline"
                      className="flex gap-2 items-center w-full"
                      type="button"
                    >
                      <Upload className="h-4 w-4" />
                      Import Settings
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="flex gap-2 items-center w-full"
                  disabled={!settings.enableCloudSync}
                >
                  <DownloadCloud className="h-4 w-4" />
                  Sync Notes Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
