
import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Bot, 
  TrendingUp, 
  Wand2, 
  Trophy, 
  FolderOpen,
  Settings,
  User,
  LogOut,
  Plug
} from 'lucide-react';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  isCollapsed?: boolean;
}

export const DesktopSidebar = ({ activeTab, onTabChange, onSignOut, isCollapsed = false }: DesktopSidebarProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'flashcards', label: 'AI Generator', icon: Wand2 },
    { id: 'ai', label: 'AI Chat', icon: Bot },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
  ];

  const secondaryNavItems = [
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col bg-background border-r border-border sticky top-0">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-border flex-shrink-0">
        {isCollapsed ? (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">StudyMate AI</h1>
              <p className="text-xs text-muted-foreground">
                {user.userType === 'exam' ? 'Exam Prep' : 'College'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`p-4 border-b border-border flex-shrink-0 ${isCollapsed ? 'px-2' : ''}`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
                {getInitials(user.name || 'U')}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
                  {getInitials(user.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs">
                  Level {user.current_level || 1}
                </Badge>
                <span className="text-muted-foreground">{user.experience_points || 0} XP</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('profile')}
                className="h-6 px-2 text-xs"
              >
                <User className="w-3 h-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <nav className={`flex-1 py-4 space-y-2 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full h-9 transition-all duration-200 ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                } ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'}`}
                onClick={() => onTabChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          {!isCollapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Tools
            </p>
          )}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full h-9 transition-all duration-200 ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                  } ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'}`}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-border flex-shrink-0 ${isCollapsed ? 'px-2' : ''}`}>
        <Button
          variant="ghost"
          className={`w-full h-9 text-foreground hover:bg-accent/50 transition-all duration-200 ${
            isCollapsed ? 'justify-center px-0' : 'justify-start px-3'
          }`}
          onClick={onSignOut}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className={`w-4 h-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span className="text-sm truncate">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};
