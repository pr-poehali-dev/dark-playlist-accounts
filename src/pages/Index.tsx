import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: string;
  liked: boolean;
  uploadDate: string;
}

interface Playlist {
  id: string;
  title: string;
  tracks: string[];
  createdDate: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      loadUserData(user.id);
    }
  }, []);

  // Audio player effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const loadUserData = (userId: string) => {
    const userTracks = localStorage.getItem(`tracks_${userId}`);
    const userPlaylists = localStorage.getItem(`playlists_${userId}`);
    
    if (userTracks) setTracks(JSON.parse(userTracks));
    if (userPlaylists) setPlaylists(JSON.parse(userPlaylists));
  };

  const saveUserData = (userId: string, newTracks?: Track[], newPlaylists?: Playlist[]) => {
    if (newTracks) localStorage.setItem(`tracks_${userId}`, JSON.stringify(newTracks));
    if (newPlaylists) localStorage.setItem(`playlists_${userId}`, JSON.stringify(newPlaylists));
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      loadUserData(user.id);
      toast({ title: "Успешно!", description: "Добро пожаловать!" });
    } else {
      toast({ title: "Ошибка", description: "Неверный email или пароль", variant: "destructive" });
    }
  };

  const handleRegister = () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === registerEmail);
    
    if (existingUser) {
      toast({ title: "Ошибка", description: "Пользователь с таким email уже существует", variant: "destructive" });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      avatar: '/img/aa8b23d0-def3-4fa6-8ef7-9af2b63eefb2.jpg'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    toast({ title: "Успешно!", description: "Аккаунт создан!" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTracks([]);
    setPlaylists([]);
    setCurrentTrack(null);
    setIsPlaying(false);
    localStorage.removeItem('currentUser');
    toast({ title: "До свидания!", description: "Вы успешно вышли из аккаунта" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !currentUser) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const audioData = e.target?.result as string;
          const newTrack: Track = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Неизвестный исполнитель',
            duration: 0,
            file: audioData,
            liked: false,
            uploadDate: new Date().toISOString()
          };
          
          const updatedTracks = [...tracks, newTrack];
          setTracks(updatedTracks);
          saveUserData(currentUser.id, updatedTracks);
          
          toast({ title: "Успешно!", description: `Трек "${newTrack.title}" загружен` });
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const toggleLike = (trackId: string) => {
    if (!currentUser) return;
    
    const updatedTracks = tracks.map(track => 
      track.id === trackId ? { ...track, liked: !track.liked } : track
    );
    setTracks(updatedTracks);
    saveUserData(currentUser.id, updatedTracks);
  };

  const createPlaylist = () => {
    if (!newPlaylistName || !currentUser) return;
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: newPlaylistName,
      tracks: [],
      createdDate: new Date().toISOString()
    };
    
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    saveUserData(currentUser.id, undefined, updatedPlaylists);
    
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
    toast({ title: "Успешно!", description: `Плейлист "${newPlaylist.title}" создан` });
  };

  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Icon name="Music" size={48} className="mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Music Collection</h1>
            <p className="text-muted-foreground">Ваша персональная коллекция музыки</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Добро пожаловать!</CardTitle>
                  <CardDescription>Войдите в свой аккаунт</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleLogin} className="w-full">
                    <Icon name="LogIn" size={16} className="mr-2" />
                    Войти
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Создать аккаунт</CardTitle>
                  <CardDescription>Присоединяйтесь к музыкальному сообществу</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input 
                      id="name" 
                      placeholder="Ваше имя"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Пароль</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRegister} className="w-full">
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Создать аккаунт
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Audio Element */}
      <audio ref={audioRef} src={currentTrack?.file} preload="metadata" />
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon name="Music" size={24} className="text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Music Collection</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{currentUser?.name}</CardTitle>
                <CardDescription>{currentUser?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{tracks.length}</div>
                      <div className="text-xs text-muted-foreground">Треков</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{playlists.length}</div>
                      <div className="text-xs text-muted-foreground">Плейлистов</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{tracks.filter(t => t.liked).length}</div>
                      <div className="text-xs text-muted-foreground">Любимых</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Heart" size={16} className="mr-2" />
                      Любимые треки ({tracks.filter(t => t.liked).length})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Actions */}
            <div className="flex gap-4 flex-wrap">
              <Dialog open={showCreatePlaylist} onOpenChange={setShowCreatePlaylist}>
                <DialogTrigger asChild>
                  <Button className="flex-1 sm:flex-none">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать плейлист
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать новый плейлист</DialogTitle>
                    <DialogDescription>
                      Введите название для вашего нового плейлиста
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Название плейлиста"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createPlaylist} className="flex-1">Создать</Button>
                      <Button variant="outline" onClick={() => setShowCreatePlaylist(false)}>Отмена</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить музыку
              </Button>
            </div>

            {/* Audio Player */}
            {currentTrack && (
              <Card className="sticky top-20 z-40">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      size="icon" 
                      onClick={togglePlayPause}
                      className="rounded-full"
                    >
                      <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{currentTrack.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{currentTrack.artist}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm text-muted-foreground">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={1}
                        onValueChange={seekTo}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon name="Volume2" size={16} />
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={(value) => setVolume(value[0])}
                        className="w-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Playlists */}
            {playlists.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Мои плейлисты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <Card key={playlist.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Icon name="Music" size={48} className="text-primary" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{playlist.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{playlist.tracks.length} треков</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Плейлист</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(playlist.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tracks List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {tracks.length === 0 ? 'Загрузите музыку' : 'Моя музыка'}
                </h2>
                <Badge variant="secondary">{tracks.length} треков</Badge>
              </div>
              
              {tracks.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Icon name="Music" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Пока что здесь пусто</h3>
                    <p className="text-muted-foreground mb-4">
                      Загрузите свои любимые треки, чтобы начать слушать музыку
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Icon name="Upload" size={16} className="mr-2" />
                      Загрузить музыку
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {tracks.map((track, index) => (
                        <div key={track.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg group">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => playTrack(track)}
                            className="shrink-0"
                          >
                            <Icon 
                              name={currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"} 
                              size={16} 
                            />
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium truncate ${
                              currentTrack?.id === track.id ? 'text-primary' : 'text-foreground'
                            }`}>
                              {track.title}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleLike(track.id)}
                            className={track.liked ? "text-red-500 hover:text-red-600" : ""}
                          >
                            <Icon name={track.liked ? "Heart" : "Heart"} size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;