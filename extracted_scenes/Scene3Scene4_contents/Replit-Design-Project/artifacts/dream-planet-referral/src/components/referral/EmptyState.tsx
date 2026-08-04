import React from 'react';

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <p className="text-gray-400 font-medium text-center" data-testid="text-empty-state">
        {message}
      </p>
    </div>
  );
}
