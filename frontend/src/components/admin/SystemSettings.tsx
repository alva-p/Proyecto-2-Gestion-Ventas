import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Settings, AlertTriangle, Package, DollarSign, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type SystemConfig = {
  stockSettings: {
    globalThreshold: number;
    criticalPercentage: number;
    autoReorderEnabled: boolean;
    autoReorderQuantity: number;
  };
  priceSettings: {
    defaultCurrency: string;
    taxRate: number;
    discountEnabled: boolean;
    maxDiscountPercentage: number;
  };
  generalSettings: {
    companyName: string;
    supportEmail: string;
    maxImageSize: number; // en MB
    allowedImageFormats: string[];
  };
};

const initialConfig: SystemConfig = {
  stockSettings: {
    globalThreshold: 15,
    criticalPercentage: 50,
    autoReorderEnabled: false,
    autoReorderQuantity: 50
  },
  priceSettings: {
    defaultCurrency: 'ARS',
    taxRate: 21, // IVA Argentina
    discountEnabled: true,
    maxDiscountPercentage: 30
  },
  generalSettings: {
    companyName: 'BuyApp',
    supportEmail: 'soporte@buyapp.com',
    maxImageSize: 5,
    allowedImageFormats: ['JPG', 'PNG', 'WebP']
  }
};

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulación de guardado
    toast.success('Configuración guardada exitosamente');
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setHasChanges(false);
    toast.info('Configuración restablecida a valores por defecto');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configuración del Sistema</span>
              </CardTitle>
              <CardDescription>
                Configura parámetros globales de la aplicación
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <Badge variant="outline" className="text-yellow-600">
                  Cambios pendientes
                </Badge>
              )}
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Restablecer
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stock" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stock" className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Inventario</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Precios</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>General</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alertas de Stock</CardTitle>
                    <CardDescription>
                      Configura los umbrales para las alertas de inventario
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="globalThreshold">Umbral Global por Defecto</Label>
                        <Input
                          id="globalThreshold"
                          type="number"
                          min="1"
                          value={config.stockSettings.globalThreshold}
                          onChange={(e) => updateConfig('stockSettings', 'globalThreshold', parseInt(e.target.value) || 0)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Cantidad mínima antes de mostrar alerta de stock bajo
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="criticalPercentage">Porcentaje para Estado Crítico (%)</Label>
                        <Input
                          id="criticalPercentage"
                          type="number"
                          min="1"
                          max="99"
                          value={config.stockSettings.criticalPercentage}
                          onChange={(e) => updateConfig('stockSettings', 'criticalPercentage', parseInt(e.target.value) || 50)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Cuando el stock sea ≤ {config.stockSettings.criticalPercentage}% del umbral = Crítico
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reorden Automático</Label>
                          <p className="text-sm text-muted-foreground">
                            Habilitar sugerencias automáticas de reorden
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.stockSettings.autoReorderEnabled}
                          onChange={(e) => updateConfig('stockSettings', 'autoReorderEnabled', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </div>

                      {config.stockSettings.autoReorderEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="autoReorderQuantity">Cantidad de Reorden por Defecto</Label>
                          <Input
                            id="autoReorderQuantity"
                            type="number"
                            min="1"
                            value={config.stockSettings.autoReorderQuantity}
                            onChange={(e) => updateConfig('stockSettings', 'autoReorderQuantity', parseInt(e.target.value) || 50)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Cantidad sugerida para reorden automático
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración de Precios</CardTitle>
                    <CardDescription>
                      Configura moneda, impuestos y descuentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultCurrency">Moneda por Defecto</Label>
                        <select
                          id="defaultCurrency"
                          value={config.priceSettings.defaultCurrency}
                          onChange={(e) => updateConfig('priceSettings', 'defaultCurrency', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="ARS">Peso Argentino (ARS)</option>
                          <option value="USD">Dólar Estadounidense (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={config.priceSettings.taxRate}
                          onChange={(e) => updateConfig('priceSettings', 'taxRate', parseFloat(e.target.value) || 0)}
                        />
                        <p className="text-sm text-muted-foreground">
                          IVA u otro impuesto aplicable
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Descuentos Habilitados</Label>
                          <p className="text-sm text-muted-foreground">
                            Permitir aplicar descuentos a productos
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.priceSettings.discountEnabled}
                          onChange={(e) => updateConfig('priceSettings', 'discountEnabled', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </div>

                      {config.priceSettings.discountEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="maxDiscountPercentage">Descuento Máximo (%)</Label>
                          <Input
                            id="maxDiscountPercentage"
                            type="number"
                            min="0"
                            max="100"
                            value={config.priceSettings.maxDiscountPercentage}
                            onChange={(e) => updateConfig('priceSettings', 'maxDiscountPercentage', parseInt(e.target.value) || 0)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Porcentaje máximo de descuento permitido
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración General</CardTitle>
                    <CardDescription>
                      Configuración básica de la aplicación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nombre de la Empresa</Label>
                        <Input
                          id="companyName"
                          value={config.generalSettings.companyName}
                          onChange={(e) => updateConfig('generalSettings', 'companyName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Email de Soporte</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={config.generalSettings.supportEmail}
                          onChange={(e) => updateConfig('generalSettings', 'supportEmail', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>Configuración de Imágenes</span>
                    </CardTitle>
                    <CardDescription>
                      Configuración para subida y gestión de imágenes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxImageSize">Tamaño Máximo de Imagen (MB)</Label>
                      <Input
                        id="maxImageSize"
                        type="number"
                        min="1"
                        max="50"
                        value={config.generalSettings.maxImageSize}
                        onChange={(e) => updateConfig('generalSettings', 'maxImageSize', parseInt(e.target.value) || 5)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Formatos Permitidos</Label>
                      <div className="flex flex-wrap gap-2">
                        {config.generalSettings.allowedImageFormats.map((format, index) => (
                          <Badge key={index} variant="outline">
                            {format}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG y WebP son formatos recomendados para productos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}