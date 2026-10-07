import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { SkinSenseProvider, useSkinSense } from './context/SkinSenseContext';
import { MotionProvider } from './components/motion/MotionProvider';
import { CustomCursor } from './components/story/CustomCursor';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Home } from './pages/Home';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { Skin } from './pages/Skin';
import { Routine } from './pages/Routine';
import { History } from './pages/History';
import { About } from './pages/About';
import { Diet } from './pages/Diet';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { EditorialButton } from './components/ui/EditorialButton';
import { AmbientGlassBackground } from './components/ui/AmbientGlassBackground';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Resilient Error Boundary to guarantee 100% stability
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SkinSense Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-white shadow-editorial border border-[#191614]/10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F9EDE8] text-[#934029] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#191614]">
              Something went unexpected
            </h2>
            <p className="font-sans text-xs text-[#6B6259]">
              {this.state.error?.message || 'An error occurred while loading this view.'}
            </p>
            <EditorialButton
              variant="primary"
              size="sm"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </EditorialButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main View Router
const PageRouter: React.FC = () => {
  const { currentPage } = useSkinSense();

  switch (currentPage) {
    case 'home':
      return <Home />;
    case 'analyze':
      return <Analyze />;
    case 'results':
      return <Results />;
    case 'skin':
      return <Skin />;
    case 'routine':
      return <Routine />;
    case 'history':
      return <History />;
    case 'about':
      return <About />;
    case 'diet':
      return <Diet />;
    case 'products':
      return <Products />;
    case 'login':
      return <Login />;
    default:
      return <Home />;
  }
};

const MainContent: React.FC = () => {
  const { currentPage } = useSkinSense();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#191614] selection:bg-[#C5A059]/25 relative">
      <AmbientGlassBackground />
      {currentPage !== 'home' && <Navbar />}
      <main className="flex-1 w-full">
        <PageRouter />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <SkinSenseProvider>
        <MotionProvider>
          <CustomCursor />
          <MainContent />
        </MotionProvider>
      </SkinSenseProvider>
    </ErrorBoundary>
  );
}

export default App;
