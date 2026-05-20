"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Home, Tent, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { getMyFavorites, removeFavorite, type FavoriteItem } from "@/lib/api";
import { formatPrice } from "@/lib/room-data";
import { RequireAuth } from "../../_components/require-auth";

export function FavoritesContent() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getMyFavorites(user.id)
        .then(setFavorites)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleRemove = async (favoriteId: string) => {
    if (!user) return;
    const result = await removeFavorite(user.id, favoriteId);
    if (result.success) {
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    }
  };

  const roomFavorites = favorites.filter((f) => f.accommodationType === "room");
  const siteFavorites = favorites.filter((f) => f.accommodationType === "site");

  return (
    <RequireAuth title="즐겨찾기">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">즐겨찾기</h1>
          <p className="mt-2 text-foreground/60">
            관심 있는 객실과 캠핑장을 모아보세요.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-foreground/30" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
            <Heart className="mx-auto size-12 text-foreground/20" />
            <p className="mt-4 text-foreground/60">즐겨찾기한 숙소가 없습니다.</p>
            <p className="mt-1 text-sm text-foreground/40">
              마음에 드는 객실이나 캠핑장을 저장해보세요.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              숙소 둘러보기
            </Link>
          </div>
        ) : (
          <>
            {/* Favorite Rooms */}
            {roomFavorites.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
                  <Home className="size-5" />
                  객실
                  <span className="text-sm text-foreground/60">({roomFavorites.length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {roomFavorites.map((item) => (
                    <FavoriteCard
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Favorite Sites */}
            {siteFavorites.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
                  <Tent className="size-5" />
                  캠핑장
                  <span className="text-sm text-foreground/60">({siteFavorites.length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {siteFavorites.map((item) => (
                    <FavoriteCard
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </RequireAuth>
  );
}

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemove: () => void;
}

function FavoriteCard({ item, onRemove }: FavoriteCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-foreground/10 bg-white transition-colors hover:border-foreground/20">
      {/* Favorite Button */}
      <button
        type="button"
        onClick={handleRemoveClick}
        disabled={isRemoving}
        className="absolute right-3 top-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Heart className="size-4 fill-current" />
      </button>

      <Link href={`/reserve?type=${item.accommodationType}&${item.accommodationType}=${item.accommodationId}`} className="flex cursor-pointer flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-sm text-foreground/60">{item.category}</p>
          <h3 className="mt-1 flex items-center gap-1 font-medium text-foreground">
            {item.name}
            <ChevronRight className="size-4 text-foreground/40" />
          </h3>
          <p className="mt-2 font-medium text-foreground">
            {formatPrice(item.price)}원<span className="text-sm font-normal text-foreground/60">/박</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
