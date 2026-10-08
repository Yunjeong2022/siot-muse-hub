import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Application,
  ApplicationStatus,
  Campaign,
  CreatorPoolEntry,
  CreatorProfile,
  PoolTier,
  ShippingRecord,
  ShippingStatus,
  Submission,
  SubmissionStatus,
  User,
} from '@/types';
import { MOCK_CAMPAIGNS } from '@/data/mockData';
import { generateId, storage } from '@/lib/storage';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AppContextValue {
  // Auth
  currentUser: User | null;
  signUp: (email: string, password: string) => AuthResult;
  logIn: (email: string, password: string) => AuthResult;
  logOut: () => void;
  loginAsAdmin: () => void;

  // Profile
  profile: CreatorProfile | null;
  saveProfile: (data: Omit<CreatorProfile, 'id' | 'userId' | 'email' | 'updatedAt'>) => void;
  isProfileComplete: boolean;

  // Campaigns
  campaigns: Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  createCampaign: (data: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => void;
  toggleCampaignStatus: (id: string) => void;

  // Applications
  applications: Application[];
  getApplicationsForUser: (userId: string) => Application[];
  hasApplied: (campaignId: string, userId: string) => boolean;
  applyToCampaign: (campaignId: string, message: string) => AuthResult;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;

  // Submissions
  submissions: Submission[];
  getSubmissionForApplication: (applicationId: string) => Submission | undefined;
  submitVideo: (applicationId: string, videoUrl: string, caption: string) => AuthResult;
  updateSubmissionStatus: (id: string, status: SubmissionStatus, notes?: string) => void;

  // Shipping
  shippingRecords: ShippingRecord[];
  getShippingForApplication: (applicationId: string) => ShippingRecord | undefined;
  updateShipping: (id: string, data: Partial<Omit<ShippingRecord, 'id'>>) => void;
  createShipping: (applicationId: string, address: Omit<ShippingRecord, 'id' | 'applicationId' | 'campaignId' | 'userId' | 'creatorName' | 'status' | 'updatedAt'>) => void;

  // Creator Pool
  poolEntries: CreatorPoolEntry[];
  updatePoolTier: (userId: string, tier: PoolTier) => void;

  // Creators (admin)
  creators: User[];
  getCreatorProfile: (userId: string) => CreatorProfile | undefined;
  getCreatorApplications: (userId: string) => Application[];
}

const AppContext = createContext<AppContextValue | null>(null);

// --- Demo admin credentials (NOT for production use) ---
const ADMIN_EMAIL = 'admin@siot.com';
const ADMIN_PASSWORD = 'admin123';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<CreatorProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [shippingRecords, setShippingRecords] = useState<ShippingRecord[]>([]);
  const [poolEntries, setPoolEntries] = useState<CreatorPoolEntry[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const storedUsers = storage.read<User[]>(storage.keys.USERS, []);
    const storedProfiles = storage.read<CreatorProfile[]>(storage.keys.PROFILES, []);
    const storedCampaigns = storage.read<Campaign[]>(storage.keys.CAMPAIGNS, []);
    const storedApplications = storage.read<Application[]>(storage.keys.APPLICATIONS, []);
    const storedSubmissions = storage.read<Submission[]>(storage.keys.SUBMISSIONS, []);
    const storedShipping = storage.read<ShippingRecord[]>(storage.keys.SHIPPING, []);
    const storedPool = storage.read<CreatorPoolEntry[]>(storage.keys.POOL, []);
    const storedCurrentUser = storage.read<User | null>(storage.keys.CURRENT_USER, null);

    setUsers(storedUsers);
    setProfiles(storedProfiles);
    setApplications(storedApplications);
    setSubmissions(storedSubmissions);
    setShippingRecords(storedShipping);
    setPoolEntries(storedPool);

    if (storedCampaigns.length > 0) {
      setCampaigns(storedCampaigns);
    } else {
      setCampaigns(MOCK_CAMPAIGNS);
      storage.write(storage.keys.CAMPAIGNS, MOCK_CAMPAIGNS);
    }

    setCurrentUser(storedCurrentUser);
  }, []);

  // Persistence helpers
  const persistUsers = (next: User[]) => { setUsers(next); storage.write(storage.keys.USERS, next); };
  const persistProfiles = (next: CreatorProfile[]) => { setProfiles(next); storage.write(storage.keys.PROFILES, next); };
  const persistCampaigns = (next: Campaign[]) => { setCampaigns(next); storage.write(storage.keys.CAMPAIGNS, next); };
  const persistApplications = (next: Application[]) => { setApplications(next); storage.write(storage.keys.APPLICATIONS, next); };
  const persistSubmissions = (next: Submission[]) => { setSubmissions(next); storage.write(storage.keys.SUBMISSIONS, next); };
  const persistShipping = (next: ShippingRecord[]) => { setShippingRecords(next); storage.write(storage.keys.SHIPPING, next); };
  const persistPool = (next: CreatorPoolEntry[]) => { setPoolEntries(next); storage.write(storage.keys.POOL, next); };

  const profile = useMemo(
    () => (currentUser ? profiles.find((p) => p.userId === currentUser.id) ?? null : null),
    [currentUser, profiles],
  );

  const isProfileComplete = useMemo(() => {
    if (!profile) return false;
    return Boolean(
      profile.firstName &&
      profile.lastName &&
      profile.tiktokUsername &&
      profile.tiktokProfileUrl &&
      profile.country,
    );
  }, [profile]);

  // --- Auth ---
  const signUp = useCallback(
    (email: string, password: string): AuthResult => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password) return { success: false, error: 'Email and password are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      if (users.some((u) => u.email === normalized)) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      const newUser: User = {
        id: generateId('user'),
        email: normalized,
        password,
        role: 'creator',
        createdAt: new Date().toISOString(),
      };
      persistUsers([...users, newUser]);
      setCurrentUser(newUser);
      storage.write(storage.keys.CURRENT_USER, newUser);
      return { success: true };
    },
    [users],
  );

  const logIn = useCallback(
    (email: string, password: string): AuthResult => {
      const normalized = email.trim().toLowerCase();
      const user = users.find((u) => u.email === normalized && u.password === password);
      if (!user) return { success: false, error: 'Invalid email or password.' };
      setCurrentUser(user);
      storage.write(storage.keys.CURRENT_USER, user);
      return { success: true };
    },
    [users],
  );

  const logOut = useCallback(() => {
    setCurrentUser(null);
    storage.write(storage.keys.CURRENT_USER, null);
  }, []);

  const loginAsAdmin = useCallback(() => {
    let admin = users.find((u) => u.role === 'admin');
    if (!admin) {
      admin = {
        id: generateId('admin'),
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      persistUsers([...users, admin]);
    }
    setCurrentUser(admin);
    storage.write(storage.keys.CURRENT_USER, admin);
  }, [users]);

  // --- Profile ---
  const saveProfile = useCallback(
    (data: Omit<CreatorProfile, 'id' | 'userId' | 'email' | 'updatedAt'>) => {
      if (!currentUser) return;
      const existing = profiles.find((p) => p.userId === currentUser.id);
      const now = new Date().toISOString();
      if (existing) {
        const updated: CreatorProfile = { ...existing, ...data, email: currentUser.email, updatedAt: now };
        persistProfiles(profiles.map((p) => (p.id === existing.id ? updated : p)));
      } else {
        const newProfile: CreatorProfile = {
          id: generateId('profile'),
          userId: currentUser.id,
          email: currentUser.email,
          ...data,
          updatedAt: now,
        };
        persistProfiles([...profiles, newProfile]);
      }
    },
    [currentUser, profiles],
  );

  // --- Campaigns ---
  const getCampaign = useCallback((id: string) => campaigns.find((c) => c.id === id), [campaigns]);

  const createCampaign = useCallback(
    (data: Omit<Campaign, 'id' | 'createdAt'>) => {
      const newCampaign: Campaign = { ...data, id: generateId('camp'), createdAt: new Date().toISOString() };
      persistCampaigns([newCampaign, ...campaigns]);
    },
    [campaigns],
  );

  const updateCampaign = useCallback(
    (id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
      persistCampaigns(campaigns.map((c) => (c.id === id ? { ...c, ...data } : c)));
    },
    [campaigns],
  );

  const toggleCampaignStatus = useCallback(
    (id: string) => {
      persistCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: c.status === 'open' ? 'closed' : 'open' } : c)),
      );
    },
    [campaigns],
  );

  // --- Applications ---
  const getApplicationsForUser = useCallback(
    (userId: string) => applications.filter((a) => a.userId === userId),
    [applications],
  );

  const hasApplied = useCallback(
    (campaignId: string, userId: string) =>
      applications.some((a) => a.campaignId === campaignId && a.userId === userId),
    [applications],
  );

  const applyToCampaign = useCallback(
    (campaignId: string, message: string): AuthResult => {
      if (!currentUser) return { success: false, error: 'You must be logged in to apply.' };
      if (currentUser.role === 'admin') return { success: false, error: 'Admins cannot apply to campaigns.' };
      if (!profile) return { success: false, error: 'Please complete your profile before applying.' };
      if (hasApplied(campaignId, currentUser.id)) return { success: false, error: 'You have already applied to this campaign.' };
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return { success: false, error: 'Campaign not found.' };
      if (campaign.status === 'closed') return { success: false, error: 'This campaign is no longer accepting applications.' };

      const newApp: Application = {
        id: generateId('app'),
        campaignId,
        userId: currentUser.id,
        creatorName: `${profile.firstName} ${profile.lastName}`,
        creatorEmail: currentUser.email,
        tiktokUsername: profile.tiktokUsername,
        tiktokProfileUrl: profile.tiktokProfileUrl,
        country: profile.country,
        instagramUsername: profile.instagramUsername,
        message,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
      persistApplications([newApp, ...applications]);
      return { success: true };
    },
    [currentUser, profile, campaigns, applications, hasApplied],
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const now = new Date().toISOString();
      const app = applications.find((a) => a.id === id);
      persistApplications(applications.map((a) => (a.id === id ? { ...a, status, reviewedAt: now } : a)));

      // When approved, auto-add to pool if not already there, and create a pending shipping record
      if (status === 'approved' && app) {
        if (!poolEntries.some((p) => p.userId === app.userId)) {
          const userApps = applications.filter((a) => a.userId === app.userId && a.status === 'approved');
          const newEntry: CreatorPoolEntry = {
            id: generateId('pool'),
            userId: app.userId,
            tier: 'standard',
            totalCampaigns: userApps.length,
            approvedCampaigns: userApps.length,
            addedAt: now,
          };
          persistPool([...poolEntries, newEntry]);
        }

        if (!shippingRecords.some((s) => s.applicationId === id)) {
          const newShipping: ShippingRecord = {
            id: generateId('ship'),
            applicationId: id,
            campaignId: app.campaignId,
            userId: app.userId,
            creatorName: app.creatorName,
            status: 'pending',
            addressLine: '',
            city: '',
            state: app.country,
            zipCode: '',
            updatedAt: now,
          };
          persistShipping([...shippingRecords, newShipping]);
        }
      }
    },
    [applications, poolEntries, shippingRecords],
  );

  // --- Submissions ---
  const getSubmissionForApplication = useCallback(
    (applicationId: string) => submissions.find((s) => s.applicationId === applicationId),
    [submissions],
  );

  const submitVideo = useCallback(
    (applicationId: string, videoUrl: string, caption: string): AuthResult => {
      if (!currentUser) return { success: false, error: 'You must be logged in.' };
      const app = applications.find((a) => a.id === applicationId);
      if (!app) return { success: false, error: 'Application not found.' };
      if (app.status !== 'approved') return { success: false, error: 'You must be approved before submitting a video.' };
      if (submissions.some((s) => s.applicationId === applicationId)) {
        return { success: false, error: 'You have already submitted a video for this campaign.' };
      }
      const newSub: Submission = {
        id: generateId('sub'),
        applicationId,
        campaignId: app.campaignId,
        userId: currentUser.id,
        creatorName: app.creatorName,
        videoUrl: videoUrl.trim(),
        caption: caption.trim(),
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
      };
      persistSubmissions([newSub, ...submissions]);
      return { success: true };
    },
    [currentUser, applications, submissions],
  );

  const updateSubmissionStatus = useCallback(
    (id: string, status: SubmissionStatus, notes?: string) => {
      const now = new Date().toISOString();
      persistSubmissions(
        submissions.map((s) => (s.id === id ? { ...s, status, reviewedAt: now, adminNotes: notes ?? s.adminNotes } : s)),
      );
    },
    [submissions],
  );

  // --- Shipping ---
  const getShippingForApplication = useCallback(
    (applicationId: string) => shippingRecords.find((s) => s.applicationId === applicationId),
    [shippingRecords],
  );

  const updateShipping = useCallback(
    (id: string, data: Partial<Omit<ShippingRecord, 'id'>>) => {
      const now = new Date().toISOString();
      persistShipping(shippingRecords.map((s) => (s.id === id ? { ...s, ...data, updatedAt: now } : s)));
    },
    [shippingRecords],
  );

  const createShipping = useCallback(
    (applicationId: string, address: Omit<ShippingRecord, 'id' | 'applicationId' | 'campaignId' | 'userId' | 'creatorName' | 'status' | 'updatedAt'>) => {
      const app = applications.find((a) => a.id === applicationId);
      if (!app) return;
      if (shippingRecords.some((s) => s.applicationId === applicationId)) return;
      const newRec: ShippingRecord = {
        id: generateId('ship'),
        applicationId,
        campaignId: app.campaignId,
        userId: app.userId,
        creatorName: app.creatorName,
        status: 'pending',
        ...address,
        updatedAt: new Date().toISOString(),
      };
      persistShipping([...shippingRecords, newRec]);
    },
    [applications, shippingRecords],
  );

  // --- Creator Pool ---
  const updatePoolTier = useCallback(
    (userId: string, tier: PoolTier) => {
      const existing = poolEntries.find((p) => p.userId === userId);
      if (existing) {
        persistPool(poolEntries.map((p) => (p.userId === userId ? { ...p, tier } : p)));
      } else {
        const userApps = applications.filter((a) => a.userId === userId);
        const newEntry: CreatorPoolEntry = {
          id: generateId('pool'),
          userId,
          tier,
          totalCampaigns: userApps.length,
          approvedCampaigns: userApps.filter((a) => a.status === 'approved').length,
          addedAt: new Date().toISOString(),
        };
        persistPool([...poolEntries, newEntry]);
      }
    },
    [poolEntries, applications],
  );

  // --- Derived ---
  const creators = useMemo(() => users.filter((u) => u.role === 'creator'), [users]);
  const getCreatorProfile = useCallback((userId: string) => profiles.find((p) => p.userId === userId), [profiles]);
  const getCreatorApplications = useCallback(
    (userId: string) => applications.filter((a) => a.userId === userId),
    [applications],
  );

  const value: AppContextValue = {
    currentUser, signUp, logIn, logOut, loginAsAdmin,
    profile, saveProfile, isProfileComplete,
    campaigns, getCampaign, createCampaign, updateCampaign, toggleCampaignStatus,
    applications, getApplicationsForUser, hasApplied, applyToCampaign, updateApplicationStatus,
    submissions, getSubmissionForApplication, submitVideo, updateSubmissionStatus,
    shippingRecords, getShippingForApplication, updateShipping, createShipping,
    poolEntries, updatePoolTier,
    creators, getCreatorProfile, getCreatorApplications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
