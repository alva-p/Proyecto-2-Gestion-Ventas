import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Search, Download, Shield, AlertTriangle, Info, CheckCircle, XCircle, Eye, Calendar, Filter } from 'lucide-react';

type AuditEvent = {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'warning';
  details: {
    oldValue?: any;
    newValue?: any;
    additionalInfo?: string;
  };
  sessionId: string;
};

const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2024-12-21T10:30:00Z',
    userId: '2',
    userEmail: 'maria.garcia@tienda.com',
    action: 'CREATE_PRODUCT',
    resource: 'products',
    resourceId: 'prod_123',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'low',
    status: 'success',
    details: {
      newValue: { name: 'Nuevo Smartphone', price: 599.99 },
      additionalInfo: 'Producto creado exitosamente'
    },
    sessionId: 'sess_abc123'
  },
  {
    id: '2',
    timestamp: '2024-12-21T09:15:00Z',
    userId: '1',
    userEmail: 'juan.perez@ejemplo.com',
    action: 'LOGIN_ATTEMPT',
    resource: 'authentication',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    severity: 'medium',
    status: 'failure',
    details: {
      additionalInfo: 'Intento de login fallido - contraseña incorrecta'
    },
    sessionId: 'sess_def456'
  },
  {
    id: '3',
    timestamp: '2024-12-21T08:45:00Z',
    userId: '2',
    userEmail: 'maria.garcia@tienda.com',
    action: 'UPDATE_USER_ROLE',
    resource: 'users',
    resourceId: 'user_789',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'high',
    status: 'success',
    details: {
      oldValue: { role: 'customer' },
      newValue: { role: 'admin' },
      additionalInfo: 'Cambio de rol de usuario'
    },
    sessionId: 'sess_abc123'
  },
  {
    id: '4',
    timestamp: '2024-12-21T07:30:00Z',
    userId: 'unknown',
    userEmail: 'unknown@suspicious.com',
    action: 'MULTIPLE_LOGIN_ATTEMPTS',
    resource: 'authentication',
    ipAddress: '203.0.113.1',
    userAgent: 'curl/7.68.0',
    severity: 'critical',
    status: 'failure',
    details: {
      additionalInfo: 'Múltiples intentos de login desde IP sospechosa'
    },
    sessionId: 'sess_suspicious'
  },
  {
    id: '5',
    timestamp: '2024-12-20T22:00:00Z',
    userId: '3',
    userEmail: 'carlos.lopez@auditoria.com',
    action: 'EXPORT_AUDIT_LOG',
    resource: 'audit',
    ipAddress: '192.168.1.75',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    severity: 'medium',
    status: 'success',
    details: {
      additionalInfo: 'Exportación de logs de auditoría'
    },
    sessionId: 'sess_ghi789'
  }
];

export function AuditLog() {
  const [events, setEvents] = useState<AuditEvent[]>(mockAuditEvents);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>(mockAuditEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterEvents(term, severityFilter, statusFilter, dateFilter);
  };

  const handleSeverityFilter = (severity: string) => {
    setSeverityFilter(severity);
    filterEvents(searchTerm, severity, statusFilter, dateFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterEvents(searchTerm, severityFilter, status, dateFilter);
  };

  const handleDateFilter = (date: string) => {
    setDateFilter(date);
    filterEvents(searchTerm, severityFilter, statusFilter, date);
  };

  const filterEvents = (term: string, severity: string, status: string, date: string) => {
    let filtered = events;

    if (term) {
      filtered = filtered.filter(event =>
        event.userEmail.toLowerCase().includes(term.toLowerCase()) ||
        event.action.toLowerCase().includes(term.toLowerCase()) ||
        event.resource.toLowerCase().includes(term.toLowerCase()) ||
        event.ipAddress.includes(term)
      );
    }

    if (severity !== 'all') {
      filtered = filtered.filter(event => event.severity === severity);
    }

    if (status !== 'all') {
      filtered = filtered.filter(event => event.status === status);
    }

    if (date !== 'all') {
      const now = new Date();
      const eventDate = new Date();
      
      switch (date) {
        case 'today':
          filtered = filtered.filter(event => {
            const eventTime = new Date(event.timestamp);
            return eventTime.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(event => {
            const eventTime = new Date(event.timestamp);
            return eventTime >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(event => {
            const eventTime = new Date(event.timestamp);
            return eventTime >= monthAgo;
          });
          break;
      }
    }

    setFilteredEvents(filtered);
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'default',
      medium: 'secondary',
      high: 'destructive',
      critical: 'destructive'
    } as const;

    const labels = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
      critical: 'Crítico'
    };

    return (
      <Badge variant={variants[severity as keyof typeof variants]}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failure':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Usuario', 'Acción', 'Recurso', 'IP', 'Severidad', 'Estado', 'Detalles'].join(','),
      ...filteredEvents.map(event => [
        event.timestamp,
        event.userEmail,
        event.action,
        event.resource,
        event.ipAddress,
        event.severity,
        event.status,
        event.details.additionalInfo || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Registro de Auditoría</span>
              </CardTitle>
              <CardDescription>
                Monitoreo de actividades y eventos de seguridad del sistema
              </CardDescription>
            </div>
            
            <Button onClick={handleExport} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={severityFilter} onValueChange={handleSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="low">Bajo</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
                <SelectItem value="failure">Fallo</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={handleDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className={event.severity === 'critical' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="text-sm">
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{event.userEmail}</div>
                        <div className="text-xs text-muted-foreground">ID: {event.userId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {formatAction(event.action)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {event.resource}
                        {event.resourceId && (
                          <div className="text-xs text-muted-foreground">ID: {event.resourceId}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{event.ipAddress}</code>
                    </TableCell>
                    <TableCell>
                      {getSeverityBadge(event.severity)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className="text-sm capitalize">{event.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Evento de Auditoría</DialogTitle>
                            <DialogDescription>
                              Información completa del evento seleccionado
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedEvent && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="font-medium">ID del Evento</Label>
                                  <div>{selectedEvent.id}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Timestamp</Label>
                                  <div>{formatTimestamp(selectedEvent.timestamp)}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Usuario</Label>
                                  <div>{selectedEvent.userEmail}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">ID de Usuario</Label>
                                  <div>{selectedEvent.userId}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Acción</Label>
                                  <div>{formatAction(selectedEvent.action)}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Recurso</Label>
                                  <div>{selectedEvent.resource}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Dirección IP</Label>
                                  <div>{selectedEvent.ipAddress}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">ID de Sesión</Label>
                                  <div>{selectedEvent.sessionId}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Severidad</Label>
                                  <div>{getSeverityBadge(selectedEvent.severity)}</div>
                                </div>
                                <div>
                                  <Label className="font-medium">Estado</Label>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(selectedEvent.status)}
                                    <span className="capitalize">{selectedEvent.status}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-medium">User Agent</Label>
                                <div className="text-sm bg-muted p-2 rounded mt-1">
                                  {selectedEvent.userAgent}
                                </div>
                              </div>
                              
                              {selectedEvent.details.additionalInfo && (
                                <div>
                                  <Label className="font-medium">Información Adicional</Label>
                                  <div className="text-sm bg-muted p-2 rounded mt-1">
                                    {selectedEvent.details.additionalInfo}
                                  </div>
                                </div>
                              )}
                              
                              {(selectedEvent.details.oldValue || selectedEvent.details.newValue) && (
                                <div className="space-y-2">
                                  <Label className="font-medium">Cambios</Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedEvent.details.oldValue && (
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Valor Anterior</Label>
                                        <pre className="text-xs bg-red-50 p-2 rounded border">
                                          {JSON.stringify(selectedEvent.details.oldValue, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    {selectedEvent.details.newValue && (
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Valor Nuevo</Label>
                                        <pre className="text-xs bg-green-50 p-2 rounded border">
                                          {JSON.stringify(selectedEvent.details.newValue, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron eventos que coincidan con los filtros.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSeverityFilter('all');
                  setStatusFilter('all');
                  setDateFilter('all');
                  setFilteredEvents(events);
                }}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}