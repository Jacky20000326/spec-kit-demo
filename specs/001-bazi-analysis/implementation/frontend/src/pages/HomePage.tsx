import { useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<
    'input' | 'chart' | 'analysis' | 'storage'
  >('input');

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
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            1
          </div>
          <div className="flex-1 border-b-2 border-gray-300 mx-2"></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'chart'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            2
          </div>
          <div className="flex-1 border-b-2 border-gray-300 mx-2"></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              currentStep === 'analysis'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            3
          </div>
          <div className="flex-1 border-b-2 border-gray-300 mx-2"></div>
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

        {/* Content Placeholder */}
        <div className="rounded-lg border-2 border-amber-200 bg-white p-8 text-center">
          {currentStep === 'input' && (
            <div>
              <p className="text-lg text-gray-600">
                步驟 1: 輸入您的出生日期（實裝中...）
              </p>
            </div>
          )}
          {currentStep === 'chart' && (
            <div>
              <p className="text-lg text-gray-600">
                步驟 2: 查看八字圖表（實裝中...）
              </p>
            </div>
          )}
          {currentStep === 'analysis' && (
            <div>
              <p className="text-lg text-gray-600">
                步驟 3: 查看分析結果（實裝中...）
              </p>
            </div>
          )}
          {currentStep === 'storage' && (
            <div>
              <p className="text-lg text-gray-600">
                步驟 4: 保存和分享（實裝中...）
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => {
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
            }}
            className="rounded-lg border border-amber-500 px-6 py-2 text-amber-600 hover:bg-amber-50"
          >
            返回
          </button>
          <button
            onClick={() => {
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
            }}
            className="rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600"
          >
            下一步
          </button>
        </div>
      </main>
    </div>
  );
}
