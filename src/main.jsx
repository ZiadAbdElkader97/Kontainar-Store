// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Spinner from './views/spinner/Spinner.jsx';
import { CustomizerContextProvider } from './context/CustomizerContext.jsx';
import './styles/scrollbar.css';

async function bootstrap() {
  // شغّل MSW في الـ DEV فقط
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./api/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
        quiet: true,
      });
    } catch (error) {
      console.warn('MSW failed to start:', error);
    }
  }

  // استورد الملفات بعد ما الـ MSW يشتغل
  await import('./utils/i18n');
  const { default: App } = await import('./App');

  ReactDOM.createRoot(document.getElementById('root')).render(
    <CustomizerContextProvider>
      <React.Suspense fallback={<Spinner />}>
        <App />
      </React.Suspense>
    </CustomizerContextProvider>,
  );
}

bootstrap();


