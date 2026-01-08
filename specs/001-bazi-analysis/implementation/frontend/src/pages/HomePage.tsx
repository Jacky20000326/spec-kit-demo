import { useState } from 'react';
import { BirthProfile } from '@/types/bazi.types';
import { BirthDateForm } from '@/components/Input/BirthDateForm';
import { BaziChartDisplay } from '@/components/Chart/BaziChart';
import { UI_MESSAGES } from '@/constants/messages';
import { useBaziCalculation } from '@/hooks/useBaziCalculation';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<
    'input' | 'chart' | 'analysis' | 'storage'
  >('input');
  const [birthProfile, setBirthProfile] = useState<BirthProfile | null>(null);

  // Fetch Bazi calculation
  const { data: baziResult, isLoading, error } = useBaziCalculation(
    currentStep === 'chart' ? birthProfile : null
  );

  const handleBirthDateSubmit = (profile: BirthProfile) => {
    setBirthProfile(profile);
    setCurrentStep('chart');
  };

  const handleNext = () => {
    const steps: Array<'input' | 'chart' | 'analysis' | 'storage'> = [
      'input',
      'chart',
      'analysis',
      'storage',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Array<'input' | 'chart' | 'analysis' | 'storage'> = [
      'input',
      'chart',
      'analysis',
      'storage',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            {UI_MESSAGES.APP_TITLE}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {UI_MESSAGES.APP_SUBTITLE}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Step Indicator */}
        <div className="mb-12 flex items-center justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'input'
                ? 'bg-amber-500 text-white'
                : currentStep === 'chart' || currentStep === 'analysis' || currentStep === 'storage'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 border-b-2 mx-2 ${
              currentStep !== 'input' ? 'border-green-500' : 'border-gray-300'
            }`}
          ></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'chart'
                ? 'bg-amber-500 text-white'
                : currentStep === 'analysis' || currentStep === 'storage'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
            }`}
          >
            2
          </div>
          <div
            className={`flex-1 border-b-2 mx-2 ${
              currentStep === 'analysis' || currentStep === 'storage'
                ? 'border-green-500'
                : 'border-gray-300'
            }`}
          ></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'analysis'
                ? 'bg-amber-500 text-white'
                : currentStep === 'storage'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
            }`}
          >
            3
          </div>
          <div
            className={`flex-1 border-b-2 mx-2 ${
              currentStep === 'storage' ? 'border-green-500' : 'border-gray-300'
            }`}
          ></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'storage'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            4
          </div>
        </div>

        {/* Content */}
        <div>
          {currentStep === 'input' && (
            <BirthDateForm onSubmit={handleBirthDateSubmit} />
          )}

          {currentStep === 'chart' && (
            <div className="space-y-6">
              {isLoading && (
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                  <p className="text-lg text-gray-600">計算中...</p>
                  <div className="mt-4 h-2 w-16 animate-pulse rounded bg-amber-400 mx-auto"></div>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 p-8 text-center shadow-lg">
                  <p className="text-lg text-red-700 font-semibold">計算失敗</p>
                  <p className="mt-2 text-sm text-red-600">{String(error)}</p>
                </div>
              )}

              {baziResult && baziResult.success && baziResult.data && (
                <BaziChartDisplay
                  chart={baziResult.data}
                  profile={birthProfile!}
                  onNext={handleNext}
                />
              )}
            </div>
          )}

          {currentStep === 'analysis' && (
            <div className="rounded-lg border-2 border-amber-200 bg-white p-8 text-center shadow-lg">
              <p className="text-lg text-gray-600">
                步驟 3: 查看分析結果（實裝中...）
              </p>
            </div>
          )}

          {currentStep === 'storage' && (
            <div className="rounded-lg border-2 border-amber-200 bg-white p-8 text-center shadow-lg">
              <p className="text-lg text-gray-600">
                步驟 4: 保存和分享（實裝中...）
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 'input' || isLoading}
            className="rounded-lg border border-amber-500 px-6 py-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            返回
          </button>
          {currentStep !== 'analysis' && currentStep !== 'storage' && (
            <button
              onClick={handleNext}
              disabled={isLoading || (currentStep === 'chart' && !baziResult?.success)}
              className="rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
