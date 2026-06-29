import type { FollowerSeller, FollowingSeller } from "../../types";
import { UserAvatar } from "../ui/UserAvatar";

type ProfileConnection = FollowingSeller | FollowerSeller;

type ProfileStatsModalProps = {
  title: string;
  users: ProfileConnection[];
  loading: boolean;
  error: string | null;
  open: boolean;
  onClose: () => void;
  onViewProfile: (id: string) => void;
  showUnfollow?: boolean;
  unfollowingId?: string | null;
  onUnfollow?: (id: string) => void;
  showAdverts?: boolean;
  emptyText: string;
};

function isVerified(connection: ProfileConnection) {
  return connection.verification?.approved === true || connection.verification?.status === "APPROVED";
}

export default function ProfileStatsModal({
  title,
  users,
  loading,
  error,
  open,
  onClose,
  onViewProfile,
  showUnfollow = false,
  unfollowingId = null,
  onUnfollow,
  showAdverts = false,
  emptyText,
}: ProfileStatsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 p-3 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-[640px] rounded-[20px] bg-white p-4 shadow-[0_20px_70px_rgba(20,18,26,0.25)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-medium text-ink sm:text-[22px]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[8px] border border-[#eceaf0] px-3 text-[14px] text-[#6c6a74] transition hover:border-[#cfcbd8]"
          >
            Close
          </button>
        </div>

        {loading ? <div className="h-[80px] animate-pulse rounded-[12px] bg-[#f6f5f8]" /> : null}
        {error ? <p className="text-[14px] text-[#d14343]">{error}</p> : null}
        {!loading && !error && users.length === 0 ? <p className="text-[14px] text-[#7d7986]">{emptyText}</p> : null}

        {!loading && !error && users.length > 0 ? (
          <div className="max-h-[62vh] space-y-3 overflow-y-auto pr-1">
            {users.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eceaf0] bg-[#faf9fc] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar
                    name={connection.fullName}
                    imageUrl={connection.profile?.avatarUrl}
                    alt={connection.fullName}
                    className="h-11 w-11 shrink-0 rounded-full object-cover text-[11px]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-ink">{connection.fullName}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {isVerified(connection) ? (
                        <span className="inline-flex items-center rounded-full bg-[#e7f4ec] px-2 py-0.5 text-[11px] font-medium text-[#248a4b]">
                          Verified
                        </span>
                      ) : null}
                      {showAdverts ? (
                        <span className="text-[12px] text-[#7d7986]">
                          {connection.stats?.adverts ?? 0} advert{(connection.stats?.adverts ?? 0) === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(connection.id)}
                    className="h-9 rounded-[8px] border border-[#eceaf0] px-3 text-[13px] text-ink transition hover:border-orange hover:text-orange"
                  >
                    View profile
                  </button>
                  {showUnfollow && onUnfollow ? (
                    <button
                      type="button"
                      onClick={() => onUnfollow(connection.id)}
                      disabled={unfollowingId === connection.id}
                      className="h-9 rounded-[8px] bg-badge-bg px-3 text-[13px] text-[#ff9715] transition-colors hover:bg-[#ffe2c5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {unfollowingId === connection.id ? "Updating..." : "Unfollow"}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
