"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Languages, Loader2, MonitorPlay, Sparkles, Square, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { languages } from "@/lib/languages";
import { getTranslation, performOcr } from "@/app/actions";
import { SettingsPanel, type DisplaySettings } from "./SettingsPanel";

type TranslationResult = {
  translatedText: string;
  detectedSourceLanguage: string;
};

const initialSettings: DisplaySettings = {
  fontSize: 24,
  opacity: 80,
  backgroundColor: '26, 0, 51',
  textColor: '240, 240, 240',
};

export function LinguaLensApp() {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("vi");
  const [isLoading, setIsLoading] = useState(false);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [settings, setSettings] = useState<DisplaySettings>(initialSettings);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("linguaLensSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      // Fallback to initial settings if parsing fails
      setSettings(initialSettings);
    }
  }, []);

  const handleSettingsChange = (newSettings: Partial<DisplaySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("linguaLensSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const captureFrameAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isOcrRunning) return;

    setIsOcrRunning(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        
        const ocrResult = await performOcr(imageDataUri);

        if (ocrResult.error) {
          toast({
            variant: "destructive",
            title: "OCR Error",
            description: ocrResult.error,
          });
        } else if (ocrResult.extractedText && ocrResult.extractedText.trim() !== sourceText.trim()) {
          setSourceText(ocrResult.extractedText);
        }
      }
    } catch (err) {
      console.error("Error during OCR processing:", err);
    } finally {
      setIsOcrRunning(false);
    }
  }, [isOcrRunning, sourceText, toast]);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);

      stream.getVideoTracks()[0].onended = () => stopCapture();

      intervalRef.current = setInterval(captureFrameAndProcess, 5000);

    } catch (err) {
      console.error("Error starting capture: ", err);
      toast({
        variant: "destructive",
        title: "Capture Error",
        description: "Could not start screen capture. Please grant permissions and try again.",
      });
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    streamRef.current = null;
    intervalRef.current = null;
    setIsCapturing(false);
    setSourceText("");
    setTranslationResult(null);
    setIsOcrRunning(false);
  };
  
  const handleTranslation = useCallback(async () => {
    if (!sourceText || !isCapturing) return;

    setIsLoading(true);
    const result = await getTranslation(sourceText, targetLanguage);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Translation Error",
        description: result.error,
      });
      setTranslationResult(null);
    } else {
      setTranslationResult(result);
      localStorage.setItem("linguaLensTranslation", JSON.stringify({text: result.translatedText, key: Date.now()}));
    }
    setIsLoading(false);
  }, [sourceText, isCapturing, targetLanguage, toast]);

  useEffect(() => {
    handleTranslation();
  }, [sourceText, handleTranslation]);

  const openDisplayWindow = () => {
    window.open("/display", "LinguaLensDisplay", "width=800,height=400,resizable=yes");
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCapturing ? (
                <Button onClick={stopCapture} className="w-full" variant="destructive">
                  <X className="mr-2 h-4 w-4" /> Stop Capture
                </Button>
              ) : (
                <Button onClick={startCapture} className="w-full">
                  <Video className="mr-2 h-4 w-4" /> Start Capture
                </Button>
              )}
              <div className="space-y-2">
                <label htmlFor="target-language" className="text-sm font-medium">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={openDisplayWindow} className="w-full" variant="outline">
                <MonitorPlay className="mr-2 h-4 w-4" /> Open Display Window
              </Button>
            </CardContent>
          </Card>

          <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Screen Capture
              </CardTitle>
              <CardDescription>
                {isCapturing ? "Your selected screen is being shared." : "Start capturing to see your screen here."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {isCapturing ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-contain"></video>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <span>Capture is inactive</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Extracted Text (Source)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-36 relative">
                  <Textarea
                    value={sourceText}
                    readOnly
                    placeholder="Text from screen will appear here..."
                    className="h-36 resize-none"
                  />
                  {isOcrRunning && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Translated Text (Target)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-36 rounded-md border bg-muted/50 p-3 text-sm">
                  {isLoading && !translationResult ? (
                    <div className="flex items-center space-x-2">
                       <Loader2 className="h-4 w-4 animate-spin" />
                       <span>Translating...</span>
                    </div>
                  ) : translationResult ? (
                    <p>{translationResult.translatedText}</p>
                  ) : (
                    <p className="text-muted-foreground">Translation will appear here...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
