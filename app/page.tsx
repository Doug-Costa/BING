// app/page.tsx
import { Suspense } from 'react';
import { HomePage } from '@/components/home-page';

export default function Page() {
  return (
    <Suspense fallback={<div className="loading-screen">Carregando...</div>}>
      <HomePage />
    </Suspense>
  );
}

/*
import { HomePage } from "@/components/home-page";
export default function Page() { return <HomePage />; }
*/