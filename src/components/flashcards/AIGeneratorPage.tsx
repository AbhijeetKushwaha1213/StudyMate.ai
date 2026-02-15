import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Library } from 'lucide-react';
import { AIStudyMaterialGenerator } from '../ai/AIStudyMaterialGenerator';
import { FlashcardVault } from './FlashcardVault';

export const AIGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Generator</h1>
          <p className="text-gray-600 mt-1">Create flashcards, quizzes, mind maps, and more with AI</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4" />
            <span>Generate</span>
          </TabsTrigger>
          <TabsTrigger value="vault" className="flex items-center space-x-2">
            <Library className="w-4 h-4" />
            <span>My Vault</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <AIStudyMaterialGenerator />
        </TabsContent>

        <TabsContent value="vault" className="mt-6">
          <FlashcardVault />
        </TabsContent>
      </Tabs>
    </div>
  );
};
