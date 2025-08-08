import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PopoverResponsive } from "@/components/ui/popover-responsive";
import { useAuth } from "@/providers/auth-provider";
import { useTranslatedRoutes } from "@/hooks/use-translated-routes";
import { userMenuRoutes } from "@/lib/routes/menus";

// Composant pour l'avatar avec fallback
function UserAvatar({ user, size = "h-6 w-6" }: { user: any; size?: string }) {
  const fallback =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <Avatar className={size}>
      <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

// Composant pour les informations utilisateur
function UserInfo({ user }: { user: any }) {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium leading-none">{user?.name}</p>
      <p className="text-xs leading-none text-muted-foreground">
        {user?.email}
      </p>
    </div>
  );
}

export default function AuthAvatar() {
  const { user, signOut } = useAuth();
  const { getTranslation } = useTranslatedRoutes();
  return (
    <PopoverResponsive
      trigger={
        <Button variant="ghost" className="flex items-center h-8 px-1 md:px-2">
          <UserAvatar user={user} size="h-8 w-8" />
          <div className="hidden md:block ml-2">
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </Button>
      }
    >
      <div className="space-y-4">
        {/* En-tête avec avatar et infos */}
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size="h-10 w-10" />
          <UserInfo user={user} />
        </div>

        {/* Menu des routes utilisateur */}
        <div className="space-y-2">
          {userMenuRoutes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant="ghost" className="w-full justify-start">
                {route.icon && <route.icon className="mr-2 h-4 w-4" />}
                {getTranslation(route)}
              </Button>
            </Link>
          ))}
        </div>

        {/* Bouton de déconnexion */}
        <div className="border-t pt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </PopoverResponsive>
  );
}
