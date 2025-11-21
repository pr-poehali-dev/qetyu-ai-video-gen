import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Video {
  id: string;
  prompt: string;
  thumbnail: string;
  status: 'generating' | 'completed';
  timestamp: Date;
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      prompt: 'Космический корабль летит сквозь звёздное небо',
      thumbnail: 'https://cdn.poehali.dev/projects/ab08b2fd-f584-4277-98fa-ab3672f00a14/files/5a2e49d4-82cd-4293-982d-d7a5e11eefcc.jpg',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      prompt: 'Абстрактные формы трансформируются в 3D пространстве',
      thumbnail: 'https://cdn.poehali.dev/projects/ab08b2fd-f584-4277-98fa-ab3672f00a14/files/5a2e49d4-82cd-4293-982d-d7a5e11eefcc.jpg',
      status: 'completed',
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const newVideo: Video = {
      id: Date.now().toString(),
      prompt: prompt,
      thumbnail: 'https://cdn.poehali.dev/projects/ab08b2fd-f584-4277-98fa-ab3672f00a14/files/5a2e49d4-82cd-4293-982d-d7a5e11eefcc.jpg',
      status: 'generating',
      timestamp: new Date()
    };

    setVideos(prev => [newVideo, ...prev]);

    setTimeout(() => {
      setVideos(prev => prev.map(v => 
        v.id === newVideo.id ? { ...v, status: 'completed' as const } : v
      ));
      setIsGenerating(false);
      setPrompt('');
    }, 5000);
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
            Создавайте потрясающие AI видео из ваших идей за секунды
          </p>
        </header>

        <div className="mb-16 animate-scale-in">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-card/80">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold mb-3 block flex items-center gap-2">
                    <Icon name="Wand2" size={20} className="text-primary" />
                    Опишите ваше видео
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
                      Генерация видео...
                    </>
                  ) : (
                    <>
                      <Icon name="Play" className="mr-2" size={24} />
                      Создать видео
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
              <Icon name="Film" size={32} className="text-primary" />
              Галерея видео
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {videos.length} видео
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card 
                key={video.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.prompt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {video.status === 'generating' && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-white font-semibold">Генерация...</p>
                        </div>
                      </div>
                    )}
                    {video.status === 'completed' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                          <Icon name="Play" className="mr-2" size={20} />
                          Смотреть
                        </Button>
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        video.status === 'generating' 
                          ? 'bg-yellow-500 animate-pulse-glow' 
                          : 'bg-green-500'
                      }`}
                    >
                      {video.status === 'generating' ? 'В процессе' : 'Готово'}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-medium text-sm line-clamp-2 text-foreground">
                      {video.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      {video.timestamp.toLocaleString('ru-RU', { 
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

          {videos.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="VideoOff" size={48} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Пока нет видео</h3>
              <p className="text-muted-foreground">
                Создайте своё первое AI видео прямо сейчас!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
