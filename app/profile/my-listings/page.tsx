'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { PawPrint, Trash2, Eye, ArrowLeft, Plus } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PawprintLoader from '@/components/ui/PawprintLoader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from 'sonner';
import { generatePetSlug } from '@/utils/slugUtils';
import type { Pet } from '@/types';

export default function MyListingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [listings, setListings] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchListings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pet_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load listings');
      } else {
        setListings((data ?? []) as Pet[]);
      }
      setIsLoading(false);
    };

    fetchListings();
  }, [user?.id]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id, name: petName } = deleteTarget;
    setDeleteTarget(null);

    setDeletingId(id);
    const { error } = await supabase
      .from('pet_listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete listing');
    } else {
      setListings(prev => prev.filter(p => p.id !== id));
      toast.success(`"${petName}" has been deleted`);
    }
    setDeletingId(null);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      adopted: 'bg-blue-100 text-blue-700 border-blue-200',
      urgent: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (authLoading || isLoading) {
    return <PawprintLoader fullScreen size="lg" message="Loading listings..." />;
  }

  if (!user) return null;

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <ScrollReveal mode="fade-up" width="100%">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/profile"
                className="inline-flex items-center text-gray-600 hover:text-playful-coral font-bold mb-2 transition-colors text-sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Profile
              </Link>
              <h1 className="text-3xl md:text-4xl font-heading font-black text-playful-text">
                My Listings 🐾
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                {listings.length} {listings.length === 1 ? 'pet' : 'pets'} listed
              </p>
            </div>

            <Link href="/list-pet">
              <PrimaryButton>
                <Plus className="h-4 w-4 mr-2" />
                List a Pet
              </PrimaryButton>
            </Link>
          </div>
        </ScrollReveal>

        {/* Listings */}
        {listings.length === 0 ? (
          <ScrollReveal mode="fade-up" delay={0.2} width="100%">
            <div className="bg-white rounded-[2rem] p-12 shadow-soft text-center">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-playful-text mb-2">
                No listings yet
              </h2>
              <p className="text-gray-600 mb-6">
                Help a pet find their forever home by listing them on our platform.
              </p>
              <Link href="/list-pet">
                <PrimaryButton>
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Pet
                </PrimaryButton>
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-4">
            {listings.map((pet, index) => (
              <ScrollReveal key={pet.id} mode="fade-up" delay={0.1 * index} width="100%">
                <div className="bg-white rounded-[1.5rem] p-4 md:p-6 shadow-soft border-2 border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Pet Image */}
                  <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {pet.image_url ? (
                      <img
                        src={pet.image_url}
                        alt={pet.pet_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PawPrint className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-bold text-playful-text truncate">
                        {pet.pet_name}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(pet.status)}`}>
                        {pet.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {pet.breed} · {pet.animal_type} · {pet.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Listed {new Date(pet.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      href={`/pet/${generatePetSlug(pet.pet_name, pet.id)}`}
                      className="flex-1 sm:flex-none"
                    >
                      <PrimaryButton variant="ghost" size="sm" className="w-full justify-center">
                        <Eye className="h-4 w-4" />
                      </PrimaryButton>
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: pet.id, name: pet.pet_name })}
                      disabled={deletingId === pet.id}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Listing?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={!!deletingId}
      />
    </div>
  );
}

