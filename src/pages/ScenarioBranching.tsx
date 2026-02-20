import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';

export default function ScenarioBranching() {
  const { user } = useAuth();
  const { currency } = useCurrency();

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 py-20 px-8">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-7xl">🌳</div>
              <div>
                <h1 className="text-6xl font-bold text-white mb-2">Scenario Branching</h1>
                <p className="text-purple-200 text-2xl">Model different life paths before you commit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="bg-white rounded-3xl p-20 text-center shadow-2xl">
            <div className="text-9xl mb-8">🌳</div>
            <h2 className="text-5xl font-bold text-secondary mb-6">Scenario Branching</h2>
            <p className="text-2xl text-slate-600 mb-10">
              Feature is loading successfully! Components will be added next.
            </p>
            <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-green-900 font-semibold text-lg">
                ✅ Page loads correctly!
              </p>
              <p className="text-green-700 mt-2">
                This confirms the route and basic setup work. 
                Full features will be added in the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
