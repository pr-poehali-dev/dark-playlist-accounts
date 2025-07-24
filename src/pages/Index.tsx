import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Алекс Музыкант',
    email: 'alex@music.ru',
    avatar: '/img/aa8b23d0-def3-4fa6-8ef7-9af2b63eefb2.jpg',
    stats: {
      tracks: 1247,
      playlists: 23,
      favorites: 89
    }
  });

  const [playlists] = useState([
    {
      id: 1,
      title: 'Любимые треки',
      tracks: 47,
      genre: 'Микс',
      lastPlayed: '2 часа назад',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&q=80'
    },
    {
      id: 2,
      title: 'Рок классика',
      tracks: 89,
      genre: 'Рок',
      lastPlayed: '1 день назад',
      cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&q=80'
    },
    {
      id: 3,
      title: 'Инди вайбс',
      tracks: 34,
      genre: 'Инди',
      lastPlayed: '3 дня назад',
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&q=80'
    }
  ]);

  const [recentTracks] = useState([
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', liked: true },
    { id: 2, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', liked: false },
    { id: 3, title: 'Hotel California', artist: 'Eagles', duration: '6:30', liked: true },
    { id: 4, title: 'Imagine', artist: 'John Lennon', duration: '3:07', liked: true },
    { id: 5, title: 'Billie Jean', artist: 'Michael Jackson', duration: '4:54', liked: false }
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
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
                    <Input id="name" placeholder="Ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Пароль</Label>
                    <Input id="reg-password" type="password" placeholder="••••••••" />
                  </div>
                  <Button onClick={handleLogin} className="w-full">
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon name="Music" size={24} className="text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Music Collection</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>AM</AvatarFallback>
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
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <CardTitle>{currentUser.name}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{currentUser.stats.tracks}</div>
                      <div className="text-xs text-muted-foreground">Треков</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{currentUser.stats.playlists}</div>
                      <div className="text-xs text-muted-foreground">Плейлистов</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{currentUser.stats.favorites}</div>
                      <div className="text-xs text-muted-foreground">Любимых</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Heart" size={16} className="mr-2" />
                      Любимые треки
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Clock" size={16} className="mr-2" />
                      История
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Настройки
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
              <Button className="flex-1 sm:flex-none">
                <Icon name="Plus" size={16} className="mr-2" />
                Создать плейлист
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить музыку
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Icon name="Radio" size={16} className="mr-2" />
                Радио
              </Button>
            </div>

            {/* Playlists Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Мои плейлисты</h2>
                <Button variant="ghost" size="sm">
                  <Icon name="MoreHorizontal" size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img 
                        src={playlist.cover} 
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="icon" className="rounded-full">
                          <Icon name="Play" size={20} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{playlist.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{playlist.tracks} треков</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{playlist.genre}</Badge>
                        <span className="text-xs text-muted-foreground">{playlist.lastPlayed}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Tracks */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Недавно прослушанные</h2>
                <Button variant="ghost" size="sm">Показать все</Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {recentTracks.map((track, index) => (
                      <div key={track.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg group">
                        <div className="w-8 text-sm text-muted-foreground text-center">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{track.title}</div>
                          <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {track.duration}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={track.liked ? "text-red-500" : ""}
                        >
                          <Icon name={track.liked ? "Heart" : "Heart"} size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <Icon name="MoreHorizontal" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;