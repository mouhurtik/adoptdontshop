'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Phone, Building2, Edit, ListChecks, PawPrint, MessageCircle, FileText, Info, Shield, LogOut, ChevronRight, Bookmark } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PawprintLoader from '@/components/ui/PawprintLoader';

export default function ProfilePage() {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const [petCount, setPetCount] = useState(0);
  const [appCount, setAppCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      // Count user's pet listings
      const { count: pets } = await supabase
        .from('pet_listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setPetCount(pets ?? 0);

      // Count applications for user's pets
      const { data: userPets } = await supabase
        .from('pet_listings')
        .select('id')
        .eq('user_id', user.id);

      if (userPets && userPets.length > 0) {
        const petIds = userPets.map(p => p.id);
        const { count: apps } = await supabase
          .from('adoption_applications')
          .select('*', { count: 'exact', head: true })
          .in('pet_listing_id', petIds);
        setAppCount(apps ?? 0);
      }
    };

    fetchStats();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return <PawprintLoader fullScreen size="lg" message="Loading profile..." />;
  }

  if (!user) return null;

  const displayName = profile?.display_name || user.displayName || user.email.split('@')[0];
  const initials = displayName.charAt(0).toUpperCase();

  // Mobile app-style menu items
  const menuItems = [
    { icon: ListChecks, label: 'My Listings', href: '/profile/my-listings', color: 'text-playful-coral' },
    { icon: MessageCircle, label: 'Messages', href: '/messages', color: 'text-blue-500' },
    { icon: FileText, label: 'My Posts', href: '/community/my-posts', color: 'text-green-500' },
    { icon: Bookmark, label: 'Saved Posts', href: '/community/saved', color: 'text-purple-500' },
    { icon: PawPrint, label: 'List a Pet', href: '/list-pet', color: 'text-playful-yellow' },
  ];

  const secondaryMenuItems = [
    { icon: Info, label: 'About', href: '/about', color: 'text-gray-500' },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin Panel', href: '/admin', color: 'text-playful-coral' }] : []),
  ];

  return (
    <div className="pt-32 lg:pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal mode="fade-up" width="100%">
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-playful-teal text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-3xl font-heading font-black text-playful-text">
                    {displayName}
                  </h1>
                  {isAdmin && (
                    <span className="bg-playful-coral text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                {profile?.account_type === 'organization' && profile.organization_name && (
                  <p className="text-playful-teal font-bold mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <Building2 className="h-4 w-4" />
                    {profile.organization_name}
                  </p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              {profile?.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-playful-coral" />
                  <span className="font-medium">{profile.location}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-playful-coral" />
                  <span className="font-medium">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4 text-playful-coral" />
                <span className="font-medium capitalize">{profile?.account_type || 'Individual'} Account</span>
              </div>
            </div>

            {profile?.bio && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal mode="fade-up" delay={0.2} width="100%">
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 shadow-soft border-2 border-playful-yellow/30 text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-playful-yellow/20 p-3 lg:p-4 w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 flex items-center justify-center rounded-full">
                <PawPrint className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
              </div>
              <p className="text-3xl lg:text-4xl font-black text-playful-text">{petCount}</p>
              <p className="text-gray-600 font-bold text-sm lg:text-base">Pets Listed</p>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 shadow-soft border-2 border-playful-teal/30 text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-playful-teal/20 p-3 lg:p-4 w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 flex items-center justify-center rounded-full">
                <Edit className="h-6 w-6 lg:h-8 lg:w-8 text-playful-teal" />
              </div>
              <p className="text-3xl lg:text-4xl font-black text-playful-text">{appCount}</p>
              <p className="text-gray-600 font-bold text-sm lg:text-base">Applications</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ===== MOBILE APP-STYLE MENU (< lg) ===== */}
        <div className="lg:hidden space-y-4 mb-8">
          {/* Primary menu */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="flex-1 font-semibold text-playful-text text-[15px]">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              );
            })}
          </div>

          {/* Secondary menu */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {secondaryMenuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors ${i < secondaryMenuItems.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="flex-1 font-semibold text-playful-text text-[15px]">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              );
            })}
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full bg-white rounded-2xl px-4 py-3.5 shadow-soft flex items-center justify-center gap-2 text-red-500 font-semibold text-[15px] active:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* ===== DESKTOP QUICK ACTIONS (≥ lg) ===== */}
        <ScrollReveal mode="fade-up" delay={0.4} width="100%">
          <div className="hidden lg:flex flex-col sm:flex-row gap-4">
            <Link href="/profile/my-listings" className="flex-1">
              <PrimaryButton variant="secondary" className="w-full justify-center">
                <ListChecks className="h-5 w-5 mr-2" />
                My Listings
              </PrimaryButton>
            </Link>
            <Link href="/list-pet" className="flex-1">
              <PrimaryButton className="w-full justify-center">
                <PawPrint className="h-5 w-5 mr-2" />
                List a New Pet
              </PrimaryButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

