import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

type UserProfileProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'auditor';
  };
};

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>Información personal y configuración de cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{user.name}</h3>
              <p className="text-muted-foreground">{user.role === 'admin' ? 'Administrador' : 'Auditor'}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                <User className="inline w-4 h-4 mr-2" />
                Nombre
              </Label>
              <Input id="name" defaultValue={user.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                <Phone className="inline w-4 h-4 mr-2" />
                Teléfono
              </Label>
              <Input id="phone" placeholder="+502 1234-5678" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">
                <MapPin className="inline w-4 h-4 mr-2" />
                Dirección
              </Label>
              <Input id="address" placeholder="Dirección completa" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="joinDate">
                <Calendar className="inline w-4 h-4 mr-2" />
                Fecha de registro
              </Label>
              <Input id="joinDate" defaultValue={new Date().toLocaleDateString()} disabled />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
