
import {
  LayoutDashboard,
  Users,
  FileText,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Alert } from '@/components/ui/Alert';

interface AdminLayoutProps {
  children: ReactNode;
  active: string;
}

const navItems = [
  { key: 'dashboard', label: '대시보드', icon: LayoutDashboard, to: '/admin' },
  { key: 'creators', label: '크리에이터 관리', icon: Users, to: '/admin/creators' },
  { key: 'applications', label: '지원자 관리', icon: FileText, to: '/admin/applications' },
  { key: 'campaigns', label: '캠페인 관리', icon: Megaphone, to: '/admin/campaigns' },
];

export function AdminLayout({ children, active }: AdminLayoutProps) {
  const { currentUser } = useApp();
  const { navigate } = useRouter();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Alert variant="warning">
          관리자 로그인이 필요합니다.
        </Alert>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 rounded-lg bg-[#142D4E] px-5 py-2.5 text-sm font-medium text-white"
        >
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <div
  className="flex min-h-screen w-full bg-white text-[#1F2937]"
  style={{
    fontFamily: '"Malgun Gothic", Arial, sans-serif',
  }}
>
      {/* 관리자 전용 사이드바 */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
        <div className="flex h-20 items-center border-b border-[#E5E7EB] px-7">
          <div>
            <h1 className="text-xl font-bold tracking-[0.12em] text-[#142D4E]">
              SIOT
            </h1>
            <p className="mt-1 text-[11px] text-[#64748B]">
              관리자 시스템
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-xs font-medium text-[#94A3B8]">
            관리 메뉴
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.to)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#142D4E] text-white'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#142D4E]'
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#F5F7FA] px-3 py-3">
            <ShieldCheck size={18} className="text-[#142D4E]" />
            <div>
              <p className="text-xs font-medium text-[#142D4E]">
                관리자 모드
              </p>
              <p className="text-[11px] text-[#64748B]">
                테스트 환경
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 관리자 메인 화면 */}
      <main className="min-w-0 flex-1 bg-white">
        <header className="flex h-20 items-center justify-between border-b border-[#E5E7EB] bg-white px-8">
          <div>
            <h2
  className="text-lg font-semibold text-[#142D4E]"
  style={{ fontFamily: '"Malgun Gothic", Arial, sans-serif' }}
>
  크리에이터 협업 관리
</h2>
            <p className="mt-1 text-xs text-[#64748B]">
              SIOT 운영 관리자
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#F1F5F9] px-3 py-1.5 text-xs font-medium text-[#475569]">
              테스트 환경
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#142D4E] text-xs font-semibold text-white">
              AD
            </div>
          </div>
        </header>

        <div className="w-full px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
