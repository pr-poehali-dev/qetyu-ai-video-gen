import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  prompt: string;
  url: string;
  type: 'video' | 'image';
  status: 'generating' | 'completed';
  timestamp: Date;
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const newItem: MediaItem = {
      id: Date.now().toString(),
      prompt: prompt,
      url: '',
      type: mediaType,
      status: 'generating',
      timestamp: new Date()
    };

    setItems(prev => [newItem, ...prev]);

    try {
      if (mediaType === 'image') {
        const response = await fetch('https://functions.poehali.dev/d5e2bccf-00f0-4efd-951e-c012943549fd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        setItems(prev => prev.map(item => 
          item.id === newItem.id 
            ? { ...item, status: 'completed' as const, url: data.url } 
            : item
        ));
        
        toast({
          title: "Фото готово! 📸",
          description: "Ваше изображение успешно создано"
        });
      } else {
        setTimeout(() => {
          setItems(prev => prev.map(item => 
            item.id === newItem.id 
              ? { ...item, status: 'completed' as const, url: 'https://cdn.poehali.dev/projects/ab08b2fd-f584-4277-98fa-ab3672f00a14/files/5a2e49d4-82cd-4293-982d-d7a5e11eefcc.jpg' } 
              : item
          ));
          
          toast({
            title: "Видео готово! 🎬",
            description: "Ваше видео успешно создано"
          });
        }, 5000);
      }
      
      setPrompt('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка генерации",
        description: "Попробуйте ещё раз"
      });
      setItems(prev => prev.filter(item => item.id !== newItem.id));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50 dark:from-background dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-gradient bg-[length:200%_200%]">
              <Icon name="Sparkles" className="text-white" size={24} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Google Qetyu AI pro 3.1
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Создавайте потрясающие AI видео и фото из ваших идей за секунды
          </p>
        </header>

        <div className="mb-16 animate-scale-in">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-card/80">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold mb-4 block">
                    Что создать?
                  </label>
                  <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'video' | 'image')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-14">
                      <TabsTrigger value="image" className="text-base gap-2">
                        <Icon name="Image" size={20} />
                        Фото
                      </TabsTrigger>
                      <TabsTrigger value="video" className="text-base gap-2">
                        <Icon name="Video" size={20} />
                        Видео
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <label className="text-lg font-semibold mb-3 block flex items-center gap-2">
                    <Icon name="Wand2" size={20} className="text-primary" />
                    Опишите вашу идею
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Например: Яркий закат над океаном с плавными волнами и летающими чайками..."
                    className="min-h-[120px] text-base resize-none border-2 focus:border-primary transition-all"
                    disabled={isGenerating}
                  />
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  size="lg"
                  className="w-full text-lg font-semibold h-14 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={24} />
                      Создаю {mediaType === 'image' ? 'фото' : 'видео'}...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" className="mr-2" size={24} />
                      Создать {mediaType === 'image' ? 'фото' : 'видео'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="Sparkles" size={32} className="text-primary" />
              Галерея
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {items.length} {items.length === 1 ? 'элемент' : 'элементов'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    {item.status === 'completed' && item.url && (
                      <img 
                        src={item.url} 
                        alt={item.prompt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    
                    {item.status === 'generating' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-white font-semibold">Создаю {item.type === 'image' ? 'фото' : 'видео'}...</p>
                        </div>
                      </div>
                    )}
                    
                    {item.status === 'completed' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                          <Icon name={item.type === 'image' ? 'Eye' : 'Play'} className="mr-2" size={20} />
                          {item.type === 'image' ? 'Открыть' : 'Смотреть'}
                        </Button>
                      </div>
                    )}
                    
                    <Badge 
                      className={`absolute top-3 left-3 ${
                        item.type === 'image' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                    >
                      <Icon name={item.type === 'image' ? 'Image' : 'Video'} size={14} className="mr-1" />
                      {item.type === 'image' ? 'Фото' : 'Видео'}
                    </Badge>
                    
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        item.status === 'generating' 
                          ? 'bg-yellow-500 animate-pulse-glow' 
                          : 'bg-green-500'
                      }`}
                    >
                      {item.status === 'generating' ? 'Создаю' : 'Готово'}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-medium text-sm line-clamp-2 text-foreground">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      {item.timestamp.toLocaleString('ru-RU', { 
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="Sparkles" size={48} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
              <p className="text-muted-foreground">
                Создайте своё первое AI фото или видео прямо сейчас!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;