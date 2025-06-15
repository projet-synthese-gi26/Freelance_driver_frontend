
import React, { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/theme/theme';

const generateColorVariants = (hexColor: string) => {
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const adjustBrightness = (rgb: number[], factor: number) => {
    return rgb.map(channel => {
      const adjusted = Math.round(channel * factor);
      return Math.min(255, Math.max(0, adjusted));
    });
  };

  const rgb = hex2rgb(hexColor);
  
  return {
    50: adjustBrightness(rgb, 1.5),
    100: adjustBrightness(rgb, 1.4),
    200: adjustBrightness(rgb, 1.3),
    300: adjustBrightness(rgb, 1.2),
    400: adjustBrightness(rgb, 1.1),
    500: rgb,
    600: adjustBrightness(rgb, 0.9),
    700: adjustBrightness(rgb, 0.8),
    800: adjustBrightness(rgb, 0.7),
    900: adjustBrightness(rgb, 0.6),
    950: adjustBrightness(rgb, 0.5),
  };
};

const updateCSSVariables = (hexColor: string) => {
  const variants = generateColorVariants(hexColor);
  
  Object.entries(variants).forEach(([key, value]) => {
    document.documentElement.style.setProperty(
      `--primary-${key}`,
      `${value[0]} ${value[1]} ${value[2]}`
    );
  });
};

const OnboardingConfig = () => {
  const { setThemeColor } = useTheme();
  const [step, setStep] = useState<number>(1);
  const [config, setConfig] = useState({
    appName: '',
    themeColor: '#0066FF'
  });

  useEffect(() => {
    if (isValidHexColor(config.themeColor)) {
      updateCSSVariables(config.themeColor);
      setThemeColor(config.themeColor);
    }
  }, [config.themeColor, setThemeColor]);

  const isValidHexColor = (color: string) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(color);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidHexColor(value)) {
      setConfig(prev => ({ ...prev, themeColor: value }));
    }
  };

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, appName: e.target.value }));
  };

  const handleSubmit = () => {
    console.log('Configuration saved:', config);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Configuration du module de paiement</h1>
          <p className="mt-2 text-gray-600">Personnalisez votre expérience de paiement</p>
        </div>

        <div className="flex justify-between items-center">
          <div className={`h-2 w-full rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`h-2 w-full rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Nom de votre application</h2>
              <input
                type="text"
                placeholder="Ex: Ma Super App"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={config.appName}
                onChange={handleAppNameChange}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!config.appName}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Suivant</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Couleur principale</h2>
              <div className="space-y-2">
                <input
                  type="color"
                  value={config.themeColor}
                  onChange={handleColorChange}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={config.themeColor}
                  onChange={handleColorChange}
                  placeholder="#000000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isValidHexColor(config.themeColor)}
                  className="w-1/2 bg-primary text-white py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Terminer</span>
                  <Check size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Nom de l'application: <span className="font-medium">{config.appName || '-'}</span></p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Couleur thème:</span>
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: isValidHexColor(config.themeColor) ? config.themeColor : '#000000' }}
              />
              <span className="text-sm font-mono">{config.themeColor}</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-11 gap-1">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`h-8 rounded bg-primary-${shade}`}
                title={`primary-${shade}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingConfig;