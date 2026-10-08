
import { AppProvider } from '@/context/AppContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CampaignsPage } from '@/pages/CampaignsPage';
import { CampaignDetailPage } from '@/pages/CampaignDetailPage';
import { MyApplicationsPage } from '@/pages/MyApplicationsPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCreators } from '@/pages/admin/AdminCreators';
import { AdminApplications } from '@/pages/admin/AdminApplications';
import { AdminCampaigns } from '@/pages/admin/AdminCampaigns';

function Routes() {
  const { path } = useRouter();

  // 관리자 페이지
  if (path === '/admin') return <AdminDashboard />;
  if (path === '/admin/creators') return <AdminCreators />;
  if (path === '/admin/applications') return <AdminApplications />;
  if (path === '/admin/campaigns') return <AdminCampaigns />;

  // 로그인 및 회원가입
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/signup') return <AuthPage mode="signup" />;

  // 크리에이터 페이지
  if (path === '/profile') return <ProfilePage />;
  if (path === '/campaigns') return <CampaignsPage />;
  if (path === '/my-applications') return <MyApplicationsPage />;

  // 캠페인 상세 페이지
  if (path.startsWith('/campaigns/')) {
    const campaignId = path.replace('/campaigns/', '');
    return <CampaignDetailPage campaignId={campaignId} />;
  }

  return <LandingPage />;
}

function AppShell() {
  const { path } = useRouter();

  const isAuthPage = path === '/login' || path === '/signup';
  const isAdminPage =
    path === '/admin' || path.startsWith('/admin/');

  // 로그인 / 회원가입 페이지
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-sage-50">
        <Routes />
      </div>
    );
  }

  // 관리자 전용 레이아웃
  // 기존 Navbar와 Footer를 표시하지 않음
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-white">
        <Routes />
      </div>
    );
  }

  // 크리에이터 전용 레이아웃
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider>
        <AppShell />
      </RouterProvider>
    </AppProvider>
  );
}
