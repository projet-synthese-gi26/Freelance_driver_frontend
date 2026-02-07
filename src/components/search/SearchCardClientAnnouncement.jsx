"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import RightModal from "@/components/modal/RightModal";
import { profileService } from "@/service/profileService";
import { reviewService } from "@/service/reviewService";
import { reactionService } from "@/service/reactionService";
import { vehicleService } from "@/service/vehicleService";
import Comment from "@/components/profile/freelance/Comment";
import { ProtectedButton } from "@/components/general/ProtectedButton";
import Emojis from "@/components/review/emojis";
import ReviewForm from "@/components/profile/freelance/ReviewForm";
import { useAuthContext } from "@/components/context/authContext";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const CURRENCY = "XAF";

const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);
};

const hasMeaningfulValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const v = String(value).trim();
  if (!v) return false;
  if (v.toLowerCase() === "n/a") return false;
  return true;
};

export default function SearchCardClientAnnouncement({
  announcement,
  onSeeMore,
  onReserve,
}) {
  const { user } = useAuthContext();
  const router = useRouter();
  const currentUserId = user?.user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [clientProfile, setClientProfile] = useState(null);
  const [cardProfilePhoto, setCardProfilePhoto] = useState("");
  const [clientReviews, setClientReviews] = useState([]);
  const [clientReactions, setClientReactions] = useState([]);
  const [clientVehicles, setClientVehicles] = useState([]);
  const [clientVehicleImages, setClientVehicleImages] = useState([]);
  const [isVehicleLoading, setIsVehicleLoading] = useState(false);
  const [reviewerProfiles, setReviewerProfiles] = useState({});
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const display = useMemo(() => {
    const authorName = announcement.authorName?.trim() || "Client";

    const hasCar =
      /car|voiture|vehicule|véhicule|vehicle/i.test(announcement.baggageInfo ?? "") ||
      (announcement.baggageInfo ?? "").includes("has car") ||
      (announcement.baggageInfo ?? "").includes("Has car");

    return {
      authorName,
      authorId: announcement.authorId || "",
      reactableId: announcement.reactableId || "",
      reactableType: announcement.reactableType || "CLIENT",
      authorPhoneNumber: announcement.authorPhoneNumber?.trim() || "",
      authorImageUrl: announcement.authorImageUrl || announcement.profileImageUrl || "",
      title: announcement.title?.trim() || "Annonce sans titre",
      pickupLocation: announcement.pickupLocation?.trim() || "",
      dropoffLocation: announcement.dropoffLocation?.trim() || "",
      startDate: announcement.startDate,
      startTime: announcement.startTime,
      endDate: announcement.endDate,
      endTime: announcement.endTime,
      cost: announcement.cost,
      isNegotiable: Boolean(announcement.isNegotiable),
      baggageInfo: announcement.baggageInfo,
      hasCar,
    };
  }, [announcement]);

  useEffect(() => {
    const authorId = display.authorId;
    if (!authorId) return;
    if (display.authorImageUrl) {
      setCardProfilePhoto("");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const profile = await profileService.getPublicUserById(authorId);
        const photo = profile?.photoUri ? String(profile.photoUri) : "";
        if (mounted) setCardProfilePhoto(photo);
      } catch (e) {
        if (mounted) setCardProfilePhoto("");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [display.authorId, display.authorImageUrl]);

  const resolvedAuthorImageUrl = useMemo(() => {
    return cardProfilePhoto || display.authorImageUrl || "/dark_avatar.svg";
  }, [cardProfilePhoto, display.authorImageUrl]);

  const handleReserve = () => {
    try {
      const bookingId = uuidv4();
      const bookingData = {
        announcement,
      };
      localStorage.setItem(bookingId, JSON.stringify(bookingData));
      router.push(`/client-booking?id=${bookingId}`);
    } catch (e) {
      console.error("Unable to start booking:", e);
      onReserve?.(announcement);
    }
  };

  const reactionTarget = useMemo(() => {
    const rawType = display.reactableType ? String(display.reactableType) : "CLIENT";
    const targetType = rawType.toUpperCase();
    const targetId = display.reactableId || display.authorId;
    return {
      targetId,
      targetType,
    };
  }, [display.authorId, display.reactableId, display.reactableType]);

  useEffect(() => {
    if (!isModalOpen) return;

    let mounted = true;
    const loadDetails = async () => {
      if (!display.authorId) return;

      setIsLoadingDetails(true);
      try {
        const [profile, reviews, reactions, vehicles] = await Promise.all([
          profileService.getPublicUserById(display.authorId),
          reviewService.getReviewsBySubject(display.authorId, "CLIENT"),
          reactionTarget.targetId && reactionTarget.targetType
            ? reactionService.getReactionsByTarget(reactionTarget.targetId, reactionTarget.targetType)
            : Promise.resolve([]),
          vehicleService.getVehiclesByDriver(display.authorId),
        ]);

        if (!mounted) return;
        setClientProfile(profile);
        const normalizedReviews = Array.isArray(reviews) ? reviews : [];
        setClientReviews(normalizedReviews);
        setClientReactions(Array.isArray(reactions) ? reactions : []);
        const normalizedVehicles = Array.isArray(vehicles) ? vehicles : [];
        setClientVehicles(normalizedVehicles);

        const mainVehicle = normalizedVehicles?.[0];
        if (mainVehicle?.vehicleId) {
          setIsVehicleLoading(true);
          try {
            const images = await vehicleService.getVehicleImages(mainVehicle.vehicleId);
            if (mounted) {
              setClientVehicleImages(Array.isArray(images) ? images : []);
            }
          } catch {
            if (mounted) setClientVehicleImages([]);
          } finally {
            if (mounted) setIsVehicleLoading(false);
          }
        } else {
          setClientVehicleImages([]);
        }

        const missingAuthorIds = Array.from(
          new Set(
            normalizedReviews
              .map((r) => r?.authorId)
              .filter((id) => id && !reviewerProfiles?.[id])
          )
        );
        if (missingAuthorIds.length > 0) {
          Promise.all(
            missingAuthorIds.map(async (userId) => {
              try {
                const user = await profileService.getPublicUserById(userId);
                const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
                const photoUri = user?.photoUri || "";
                return [userId, { name: name || userId, photoUri }];
              } catch {
                return [userId, { name: userId, photoUri: "" }];
              }
            })
          ).then((entries) => {
            if (!mounted) return;
            setReviewerProfiles((prev) => {
              const next = { ...(prev || {}) };
              for (const [userId, data] of entries) {
                next[userId] = data;
              }
              return next;
            });
          });
        }
      } catch (e) {
        if (!mounted) return;
        setClientProfile(null);
        setClientReviews([]);
        setClientReactions([]);
        setClientVehicles([]);
        setClientVehicleImages([]);
      } finally {
        if (mounted) setIsLoadingDetails(false);
      }
    };

    loadDetails();
    return () => {
      mounted = false;
    };
  }, [isModalOpen, display.authorId, reactionTarget.targetId, reactionTarget.targetType]);

  const reviewSummary = useMemo(() => {
    const list = Array.isArray(clientReviews) ? clientReviews : [];
    const ratingValues = list
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n > 0);
    const averageRating = ratingValues.length
      ? ratingValues.reduce((s, n) => s + n, 0) / ratingValues.length
      : 0;
    return { averageRating, total: list.length };
  }, [clientReviews]);

  const mappedClientReviews = useMemo(() => {
    const list = Array.isArray(clientReviews) ? clientReviews : [];
    return list.map((r) => {
      const profile = reviewerProfiles?.[r?.authorId];
      const fallbackName = r?.authorId && currentUserId && r.authorId === currentUserId ? "Vous" : "Utilisateur";
      const reviewerName = profile?.name || fallbackName;
      return {
        review_id: r?.id,
        rated_entity_id: r?.subjectId ?? display.authorId,
        rated_entity_type: r?.subjectType ?? "CLIENT",
        comment: r?.comment ?? "",
        created_at: r?.createdAt ?? "",
        updated_at: r?.updatedAt ?? r?.createdAt ?? "",
        note: Number(r?.rating ?? 0),
        likes_count: Number(r?.reactionCounts?.LIKE ?? 0),
        dislikes_count: Number(r?.reactionCounts?.DISLIKE ?? 0),
        icon: "",
        reviewer_name: reviewerName,
        reviewer_avatar: profile?.photoUri || "",
      };
    });
  }, [clientReviews, reviewerProfiles, display.authorId, currentUserId]);

  const stats = useMemo(() => {
    const ratings = (clientReviews || [])
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n > 0);
    const averageRating = ratings.length ? ratings.reduce((s, n) => s + n, 0) / ratings.length : 0;
    const likeCount = (clientReactions || []).filter((r) => r?.type === "LIKE").length;
    const dislikeCount = (clientReactions || []).filter((r) => r?.type === "DISLIKE").length;
    return {
      averageRating,
      reviewCount: (clientReviews || []).length,
      likeCount,
      dislikeCount,
    };
  }, [clientReviews, clientReactions]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleRateClient = async () => {
    if (!display.authorId) return;
    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        subjectId: display.authorId,
        subjectType: "CLIENT",
        reviewType: "RATING",
        rating: Number(ratingValue),
        comment: ratingComment?.trim() ? ratingComment.trim() : null,
      });

      const reviews = await reviewService.getReviewsBySubject(display.authorId, "CLIENT");
      setClientReviews(Array.isArray(reviews) ? reviews : []);
      setRatingComment("");
      setIsRatingModalOpen(false);
    } catch (e) {
      console.error("Unable to submit rating:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalProfile = useMemo(() => {
    const firstName = clientProfile?.firstName || clientProfile?.user?.firstName;
    const lastName = clientProfile?.lastName || clientProfile?.user?.lastName;
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim() || display.authorName;

    const rawEmail = clientProfile?.email || clientProfile?.user?.email;
    const rawPhone = clientProfile?.phone || clientProfile?.user?.phone;
    const rawPhotoUri = clientProfile?.photoUri || clientProfile?.user?.photoUri;

    const email = rawEmail ? String(rawEmail).trim() : "";
    const phone = rawPhone ? String(rawPhone).trim() : "";
    const photoUri = rawPhotoUri ? String(rawPhotoUri).trim() : "";

    return {
      name: fullName,
      subtitle: display.title,
      email,
      phone: phone || display.authorPhoneNumber,
      imageUrl: photoUri || resolvedAuthorImageUrl,
    };
  }, [clientProfile, display.authorName, display.authorPhoneNumber, display.title, resolvedAuthorImageUrl]);

  const handleReportClient = async () => {
    if (!display.authorId) return;
    const reason = reportReason?.trim();
    if (!reason) {
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        subjectId: display.authorId,
        subjectType: "CLIENT",
        reviewType: "REPORT",
        reportReason: reason,
      });

      setReportReason("");
      setIsReportModalOpen(false);
    } catch (e) {
      console.error("Unable to submit report:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReact = async (type) => {
    if (!reactionTarget.targetId || !reactionTarget.targetType) return;
    setIsSubmitting(true);
    try {
      await reactionService.createReaction({
        targetId: reactionTarget.targetId,
        targetType: reactionTarget.targetType,
        type,
      });
      const reactions = await reactionService.getReactionsByTarget(reactionTarget.targetId, reactionTarget.targetType);
      setClientReactions(Array.isArray(reactions) ? reactions : []);
    } catch (e) {
      console.error("Unable to send reaction:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md md:min-h-[360px] lg:col-span-2">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

      <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100 md:h-auto md:min-h-[320px] md:w-64">
          <Image
            fill
            src={resolvedAuthorImageUrl}
            alt={display.authorName}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900">{display.authorName}</h2>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {display.title}
                </span>
                {display.hasCar ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                    <CheckBadgeIcon className="h-4 w-4 text-slate-600" />
                    Has car
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    display.isNegotiable ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Négociable: {display.isNegotiable ? "Oui" : "Non"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-700">{formatPrice(display.cost)}</span>
                <span className="text-sm font-semibold text-slate-500">budget</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[170px]">
              <button
                type="button"
                onClick={() => {
                  handleOpenModal();
                  onSeeMore?.(announcement);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                Voir plus
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleReserve}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Réserver
                <TruckIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Trajet</span>
              </div>
              <div className="mt-2 font-semibold text-slate-900">
                {display.pickupLocation || "Départ non précisé"}
                <span className="mx-2 text-slate-300">→</span>
                {display.dropoffLocation || "Arrivée non précisée"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDaysIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Date</span>
              </div>
              <div className="mt-2 font-semibold text-slate-900">
                {display.startDate ? new Date(display.startDate).toLocaleDateString("fr-FR") : "N/A"}
                {display.startTime ? ` · ${String(display.startTime).slice(0, 5)}` : ""}
              </div>
            </div>
          </div>

          {(hasMeaningfulValue(display.authorPhoneNumber) || hasMeaningfulValue(display.baggageInfo)) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hasMeaningfulValue(display.authorPhoneNumber) ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  <PhoneIcon className="h-4 w-4 text-slate-500" />
                  {display.authorPhoneNumber}
                </span>
              ) : null}

              {hasMeaningfulValue(display.baggageInfo) ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {String(display.baggageInfo)}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <RightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <div className="py-[30px] lg:py-[60px] text bg-[var(--bg-2)] px-3">
            <div className="container max-w-full">
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <div className="col-span-1">
                  <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-6 lg:px-6 mb-2">
                    <div className="text relative px-12">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                        <Emojis driver_id={reactionTarget.targetId} targetType={reactionTarget.targetType} vertical={true} />
                        <ProtectedButton
                          onProtectedClick={() => setIsRatingModalOpen(true)}
                          className="flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Noter
                        </ProtectedButton>
                        <ProtectedButton
                          onProtectedClick={() => setIsReportModalOpen(true)}
                          className="flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Signaler
                        </ProtectedButton>
                      </div>

                      <div className="w-32 h-32 text border overflow-hidden border-[var(--primary)] rounded-full bg-white p-4 grid place-content-center relative mx-auto mb-2">
                        <Image width={130} height={130} src={modalProfile.imageUrl} alt="image" className="rounded-full w-full h-full" unoptimized />
                      </div>
                      <h4 className="text-center title font-semibold mb-1">{modalProfile.name}</h4>
                      <div className="flex items-center justify-center flex-wrap mb-2">
                        <p className="mb-0 flex flex-col w-full text-center relative group">
                          Contact:
                          <span className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer">
                            {modalProfile.phone || "N/A"}
                          </span>
                          <span className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer">
                            {modalProfile.email || "N/A"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center justify-center flex-wrap mb-2">
                        <div className="flex min-w-full justify-center items-center my-1 px-4 mx-8 space-x-4">
                          <div className="flex items-center">
                            <span className="mr-1">{reviewSummary.averageRating.toFixed(1)}</span>{" "}
                            <StarIcon className="w-4 h-4 text-[var(--tertiary)]" />
                            <span className="ml-2 text-gray-500"> {reviewSummary.total} avis</span>{" "}
                          </div>
                        </div>
                      </div>

                      <div className="border border-dashed my-2"></div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trajet</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {display.pickupLocation || "Départ non précisé"} → {display.dropoffLocation || "Arrivée non précisée"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Date</p>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {display.startDate ? new Date(display.startDate).toLocaleDateString("fr-FR") : "N/A"}
                            {display.startTime ? ` · ${String(display.startTime).slice(0, 5)}` : ""}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Budget</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPrice(display.cost)}</p>
                          <p className="text-sm text-slate-500">Négociable: {display.isNegotiable ? "Oui" : "Non"}</p>
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                handleReserve();
                                setIsModalOpen(false);
                              }}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                              Réserver
                              <TruckIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {hasMeaningfulValue(display.baggageInfo) ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bagages</p>
                            <p className="mt-2 text-sm text-slate-700">{String(display.baggageInfo)}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {clientVehicles?.length ? (
                    <div className="p-3 bg-white rounded-2xl mb-8">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Véhicule</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Marque</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{clientVehicles?.[0]?.brand || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Immatriculation</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{clientVehicles?.[0]?.registrationNumber || "N/A"}</p>
                          </div>
                        </div>
                        {isVehicleLoading ? (
                          <div className="mt-4 text-sm text-slate-500">Chargement des images...</div>
                        ) : null}
                        {Array.isArray(clientVehicleImages) && clientVehicleImages.length ? (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {clientVehicleImages.slice(0, 6).map((img) => (
                              <div key={img.vehicleIllustrationImageId || img.imagePath} className="relative h-20 w-28 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                                <Image fill src={img.imagePath} alt="vehicle" className="object-cover" unoptimized sizes="112px" />
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <div className="mb-4">
                      <ProtectedButton
                        onProtectedClick={() => setIsReviewModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Écrire un commentaire
                      </ProtectedButton>
                    </div>
                    <div className="rounded-2xl bg-white">
                      <Comment comments={mappedClientReviews} isModal={true} rated_entity_type={"Client"} rated_entity_id={display.authorId} commentsPerPage={10} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isRatingModalOpen ? (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">×</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre note</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRatingValue(n)}
                      className={`h-10 w-10 rounded-xl text-sm font-extrabold transition ${
                        ratingValue === n
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Commentaire (optionnel)"
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  rows={3}
                />
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleRateClient}
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Envoyer la note
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {isReportModalOpen ? (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">×</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Signaler</h2>
                <div className="text-xs font-semibold text-slate-600">Utilise cette option en cas d'abus.</div>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Raison du signalement"
                  className="mt-3 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                  rows={3}
                />
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleReportClient}
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
                  >
                    Envoyer le signalement
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {isLoadingDetails ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Chargement...
            </div>
          ) : null}

          {isReviewModalOpen ? (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">×</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre avis</h2>
                <ReviewForm
                  subjectId={display.authorId}
                  subjectType="CLIENT"
                  onSuccess={(createdReview) => {
                    if (createdReview?.id) {
                      setClientReviews((prev) => {
                        const list = Array.isArray(prev) ? prev : [];
                        if (list.some((r) => r?.id === createdReview.id)) return list;
                        return [...list, createdReview];
                      });
                    }
                    setIsReviewModalOpen(false);
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </RightModal>
    </div>
  );
}
