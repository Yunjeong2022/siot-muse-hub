
import {
  ArrowRight,
  Gift,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  UserPlus,
  ClipboardList,
  Video,
  Wallet,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';

export function LandingPage() {
  const { campaigns, currentUser } = useApp();
  const { navigate } = useRouter();

  const openCampaigns = campaigns.filter(
    (campaign) => campaign.status === 'open'
  );

  const featured = openCampaigns.slice(0, 3);

  const goToJoin = () => {
    navigate(currentUser ? '/campaigns' : '/signup');
  };

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Join the Community',
      description: 'Create your account and complete your creator profile.',
    },
    {
      number: '02',
      icon: ClipboardList,
      title: 'Explore & Apply',
      description: 'Discover SIOT campaigns and apply for collaborations.',
    },
    {
      number: '03',
      icon: Video,
      title: 'Create Content',
      description: 'Get selected, follow the brief, and create your content.',
    },
    {
      number: '04',
      icon: Wallet,
      title: 'Get Rewarded',
      description: 'Receive the rewards offered by your campaign.',
    },
  ];

  return (
    <div
      className="min-h-screen bg-white text-[#172033]"
      style={{
        fontFamily:
          '"Pretendard", "Malgun Gothic", Arial, sans-serif',
      }}
    >
      {/* HERO */}
      <section className="border-b border-[#E9EDF2] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE4EF] bg-[#F7F9FC] px-4 py-2 text-xs font-semibold tracking-wide text-[#142D4E]">
              <Sparkles size={15} />
              SIOT CREATOR COMMUNITY
            </div>

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-[#142D4E] sm:text-5xl lg:text-[60px]">
              Become a
              <br />
              Muse of SIOT.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#64748B] sm:text-lg">
              Your creativity meets Korean skincare.
              Discover exclusive SIOT campaigns,
              collaborate with our brand, and grow
              as a creator.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#142D4E] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#25466F]"
              >
                Explore Campaigns
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={goToJoin}
                className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-7 py-3.5 text-sm font-semibold text-[#142D4E] transition-colors hover:bg-[#F5F7FA]"
              >
                {currentUser ? 'My Opportunities' : 'Join as Creator'}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-[#64748B]">
              <CheckCircle2 size={17} className="text-[#142D4E]" />
              Free to join · Open to eligible creators
            </div>
          </div>

          {/* 브랜드 이미지 영역 */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-[#F4F6F8]">
              <img
                src="https://images.pexels.com/photos/7161668/pexels-photo-7161668.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Skincare creator"
                className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[500px]"
              />
            </div>

            <div className="absolute -bottom-5 left-5 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm sm:left-8">
              <p className="text-xs font-medium tracking-widest text-[#64748B]">
                SIOT MUSE HUB
              </p>
              <p className="mt-1 text-sm font-semibold text-[#142D4E]">
                Create · Collaborate · Grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#64748B]">
                OPPORTUNITIES
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#142D4E] sm:text-4xl">
                Explore Open Campaigns
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#64748B]">
                Find your next collaboration with SIOT.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#142D4E] hover:underline"
            >
              View All Campaigns
              <ArrowRight size={16} />
            </button>
          </div>

          {featured.length > 0 ? (
            <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((campaign) => (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() =>
                    navigate(`/campaigns/${campaign.id}`)
                  }
                  className="group overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-[#F5F7FA]">
                    <img
                      src={campaign.productImage}
                      alt={campaign.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#142D4E] shadow-sm">
                      Open
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-[#142D4E]">
                      {campaign.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#64748B]">
                      {campaign.subtitle}
                    </p>

                    <div className="mt-5 flex items-start gap-2 text-sm font-medium text-[#142D4E]">
                      <Gift size={17} className="mt-0.5 shrink-0" />
                      <span>{campaign.rewardSummary}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-[#64748B]">
                      <CalendarDays size={15} />
                      Apply by{' '}
                      {new Date(campaign.deadline).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#E9EDF2] pt-5">
                      <span className="text-sm font-semibold text-[#142D4E]">
                        View Details
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-[#142D4E] transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-9 rounded-2xl border border-[#E5EAF0] bg-[#F8FAFC] px-6 py-14 text-center">
              <p className="text-lg font-semibold text-[#142D4E]">
                New campaigns are coming soon.
              </p>
              <p className="mt-2 text-sm text-[#64748B]">
                Check back for upcoming opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-[#E9EDF2] bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#64748B]">
              YOUR CREATOR JOURNEY
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#142D4E] sm:text-4xl">
              How It Works
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
              From your first application to your next
              collaboration, everything starts here.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-[#E5EAF0] bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3F9] text-[#142D4E]">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-semibold text-[#94A3B8]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-[#142D4E]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#64748B]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="rounded-3xl bg-[#142D4E] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
              <Sparkles size={23} />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your SIOT journey starts here.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#D5E0EE] sm:text-base">
              Join our creator community and discover
              opportunities to create with SIOT.
            </p>

            <button
              type="button"
              onClick={goToJoin}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#142D4E] transition-colors hover:bg-[#EAF0F7]"
            >
              {currentUser ? 'Explore Campaigns' : 'Become a SIOT Muse'}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
