
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Save, Unplug, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCredentials, saveCredentials, clearCredentials, isConnected } from '@/lib/supabase-credentials';

const maskValue = (value: string): string => {
  if (!value || value.length <= 4) return value;
  const visibleCount = Math.max(1, Math.ceil(value.length * 0.2));
  const maskedCount = value.length - visibleCount;
  return '*'.repeat(maskedCount) + value.slice(-visibleCount);
};

const Credentials = () => {
  const { toast } = useToast();
  const [projectId, setProjectId] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showProjectId, setShowProjectId] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const creds = getCredentials();
    setProjectId(creds.projectId);
    setSupabaseUrl(creds.supabaseUrl);
    setSupabaseKey(creds.supabaseKey);
    setConnected(isConnected());
  }, []);

  const handleSave = () => {
    if (!projectId.trim() || !supabaseUrl.trim() || !supabaseKey.trim()) {
      toast({
        title: 'Missing credentials',
        description: 'Please fill in all three fields before saving.',
        variant: 'destructive',
      });
      return;
    }
    saveCredentials({ projectId, supabaseUrl, supabaseKey });
    setConnected(true);
    toast({
      title: 'Credentials saved',
      description: 'Supabase client has been reinitialized with new credentials.',
    });
  };

  const handleDisconnect = () => {
    clearCredentials();
    setProjectId('');
    setSupabaseUrl('');
    setSupabaseKey('');
    setConnected(false);
    toast({
      title: 'Disconnected',
      description: 'All credentials have been cleared and Supabase client reset.',
    });
  };

  const renderField = (
    label: string,
    description: string,
    value: string,
    setValue: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="relative">
        <Input
          type="text"
          value={show ? value : maskValue(value)}
          onChange={(e) => {
            if (show) setValue(e.target.value);
          }}
          onFocus={() => setShow(true)}
          placeholder={placeholder}
          className="pr-10 font-mono text-sm bg-background border-border"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Credentials</h1>
            <p className="text-sm text-muted-foreground">Configure your Supabase connection</p>
          </div>
          <div className="ml-auto">
            {connected ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={14} /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <AlertCircle size={14} /> Not connected
              </span>
            )}
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Supabase Configuration</CardTitle>
            <CardDescription>
              Enter your Supabase project credentials below. Values are masked for security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderField(
              'Project ID',
              'Syncs with supabase/config.toml → project_id',
              projectId,
              setProjectId,
              showProjectId,
              setShowProjectId,
              'e.g. abcdefghijklmnop'
            )}
            {renderField(
              'Supabase URL',
              'Syncs with supabase client → SUPABASE_URL',
              supabaseUrl,
              setSupabaseUrl,
              showUrl,
              setShowUrl,
              'e.g. https://xxxxx.supabase.co'
            )}
            {renderField(
              'Supabase Publishable Key',
              'Syncs with supabase client → SUPABASE_PUBLISHABLE_KEY',
              supabaseKey,
              setSupabaseKey,
              showKey,
              setShowKey,
              'e.g. eyJhbGciOiJIUzI1NiIs...'
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Save size={16} /> Save
              </Button>
              <Button onClick={handleDisconnect} variant="destructive" className="flex-1 gap-2">
                <Unplug size={16} /> Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Credentials;
