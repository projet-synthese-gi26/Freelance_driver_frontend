"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import {
  ArrowsUpDownIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MapPinIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

import { createAutocomplete } from "@/scripts/autocomplete";
import { announcementService } from "@/service/announcementService";
import { toast } from "react-hot-toast";

import SearchCardClientAnnouncement from "@/components/search/SearchCardClientAnnouncement";

const AnnouncementMapNavigoo = dynamic(
  () => import("@/components/search/AnnouncementMapNavigoo"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    ),
  }
);

export default function ClientSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const departureBase = searchParams.get("departure");
  const destinationBase = searchParams.get("destination");

  const locationRef = useRef(null);
  const destinationRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(departureBase || "");
  const [destination, setDestination] = useState(destinationBase || "");
  const [viewMode, setViewMode] = useState("map");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    maxCost: "",
    negotiableOnly: false,
    hasCarOnly: false,
    sortBy: "recent",
  });

  const loadPublishedAnnouncements = async () => {
    setIsLoading(true);
    try {
      const announcements = await announcementService.getPublishedAnnouncements();
      setSearchResults(Array.isArray(announcements) ? announcements : []);
    } catch (error) {
      console.error("Client search error:", error);
      toast.error("Erreur lors du chargement des annonces.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const costRange = useMemo(() => {
    const data = Array.isArray(searchResults) ? searchResults : [];
    const values = data
      .map((a) => Number(a.cost ?? 0))
      .filter((v) => Number.isFinite(v) && v >= 0);
    if (!values.length) return { min: 0, max: 0 };
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [searchResults]);

  const filteredResults = useMemo(() => {
    const data = Array.isArray(searchResults) ? searchResults : [];

    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    const maxCost = filters.maxCost ? Number(filters.maxCost) : null;

    const filtered = data.filter((a) => {
      if (start && a.startDate) {
        const d = new Date(a.startDate);
        if (d < start) return false;
      }
      if (end && a.startDate) {
        const d = new Date(a.startDate);
        if (d > end) return false;
      }

      if (maxCost !== null && Number.isFinite(maxCost)) {
        const c = Number(a.cost ?? 0);
        if (Number.isFinite(c) && c > maxCost) return false;
      }

      if (filters.negotiableOnly && !Boolean(a.isNegotiable)) return false;

      if (filters.hasCarOnly) {
        const baggage = String(a.baggageInfo ?? "");
        const hasCar = /car|voiture|vehicule|véhicule|vehicle/i.test(baggage);
        if (!hasCar) return false;
      }

      return true;
    });

    if (filters.sortBy === "priceLow") {
      return [...filtered].sort((x, y) => Number(x.cost ?? 0) - Number(y.cost ?? 0));
    }
    if (filters.sortBy === "priceHigh") {
      return [...filtered].sort((x, y) => Number(y.cost ?? 0) - Number(x.cost ?? 0));
    }
    if (filters.sortBy === "recent") {
      return [...filtered].sort((x, y) => {
        const dx = x.createdAt ? new Date(x.createdAt).getTime() : new Date(x.startDate ?? 0).getTime();
        const dy = y.createdAt ? new Date(y.createdAt).getTime() : new Date(y.startDate ?? 0).getTime();
        return dy - dx;
      });
    }

    return filtered;
  }, [filters, searchResults]);

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      maxCost: "",
      negotiableOnly: false,
      hasCarOnly: false,
      sortBy: "recent",
    });
  };

  const goToFreelanceSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    router.push(`/freelance-search?${params.toString()}`);
  };

  useEffect(() => {
    const locationAutocomplete = createAutocomplete("location", (selectedValue) => {
      setLocation(selectedValue);
    });
    const destinationAutocomplete = createAutocomplete("destination", (selectedValue) => {
      setDestination(selectedValue);
    });

    loadPublishedAnnouncements();

    return () => {
      if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
      if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const announcements = await announcementService.getPublishedAnnouncements();
      const data = Array.isArray(announcements) ? announcements : [];

      const dep = location.trim().toLowerCase();
      const dest = destination.trim().toLowerCase();

      const filtered = data.filter((a) => {
        if (dep) {
          const pickup = String(a.pickupLocation ?? "").toLowerCase();
          const full = String(a.fullLocation ?? "").toLowerCase();
          if (!pickup.includes(dep) && !full.includes(dep)) return false;
        }
        if (dest) {
          const dropoff = String(a.dropoffLocation ?? "").toLowerCase();
          if (!dropoff.includes(dest)) return false;
        }
        return true;
      });

      const params = new URLSearchParams(searchParams?.toString());
      if (location?.trim()) params.set("departure", location.trim());
      else params.delete("departure");

      if (destination?.trim()) params.set("destination", destination.trim());
      else params.delete("destination");

      router.push(`/client-search?${params.toString()}`);
      setSearchResults(filtered);
    } catch (error) {
      console.error("Client search error:", error);
      toast.error("Erreur lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindAll = async () => {
    setIsLoading(true);
    try {
      const announcements = await announcementService.getPublishedAnnouncements();
      const data = Array.isArray(announcements) ? announcements : [];
      setSearchResults(data);
      toast.success(`${data.length} annonces trouvées.`);
    } catch (error) {
      console.error("Client search error:", error);
      toast.error("Erreur lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementSelect = (announcement) => {
    if (!announcement?.id) return;
    return;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      <div className="container mx-auto px-4 py-8 font-inter">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-700">
              Are you a driver? Find a client.
            </div>
            <button
              type="button"
              onClick={goToFreelanceSearch}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
            >
              Go to freelance search
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-slate-200">
            <MagnifyingGlassIcon className="h-7 w-7 text-slate-700" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative auto-search-wrapper">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-slate-500" />
                    Lieu de départ
                  </span>
                </label>
                <MapPinIcon className="pointer-events-none absolute left-3 top-[44px] h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="location"
                  ref={locationRef}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Yaoundé Centre"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="relative auto-search-wrapper">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-slate-500" />
                    Destination
                  </span>
                </label>
                <MapPinIcon className="pointer-events-none absolute left-3 top-[44px] h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="destination"
                  ref={destinationRef}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Douala"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors duration-200"
              >
                {isLoading ? "Recherche..." : "Rechercher"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 ${
                    viewMode === "map"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                  Carte
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 ${
                    viewMode === "list"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                  Liste
                </button>
              </div>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:flex-row">
              <aside className="w-full lg:w-[22rem]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-900">Filtres</h3>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Réinitialiser
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">Début (date)</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600">Fin (date)</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600">Budget max</label>
                      <input
                        type="number"
                        min={0}
                        placeholder={costRange.max ? String(costRange.max) : ""}
                        value={filters.maxCost}
                        onChange={(e) => setFilters((p) => ({ ...p, maxCost: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      />
                      {costRange.max > 0 && (
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          Fourchette: {costRange.min} - {costRange.max}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Négociable</p>
                        <p className="text-[11px] font-medium text-slate-500">Uniquement les offres négociables</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={filters.negotiableOnly}
                        onChange={(e) => setFilters((p) => ({ ...p, negotiableOnly: e.target.checked }))}
                        className="h-5 w-5 accent-emerald-600"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Has car</p>
                        <p className="text-[11px] font-medium text-slate-500">Clients disposant d'une voiture</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={filters.hasCarOnly}
                        onChange={(e) => setFilters((p) => ({ ...p, hasCarOnly: e.target.checked }))}
                        className="h-5 w-5 accent-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600">Trier</label>
                      <div className="relative mt-1">
                        <ArrowsUpDownIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <select
                          value={filters.sortBy}
                          onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                          <option value="recent">Plus récentes</option>
                          <option value="priceLow">Prix: bas → haut</option>
                          <option value="priceHigh">Prix: haut → bas</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <section className="min-w-0 flex-1">
                {viewMode === "map" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <AnnouncementMapNavigoo
                        announcements={filteredResults}
                        onAnnouncementSelect={handleAnnouncementSelect}
                        className="h-[500px]"
                      />
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-t border-gray-100">
                        <p className="text-sm text-gray-600 text-center">
                          <span className="inline-flex items-center justify-center gap-2">
                            <LightBulbIcon className="h-4 w-4 text-slate-500" />
                            Cliquez sur un marqueur pour voir les détails de l'annonce
                          </span>
                        </p>
                      </div>
                    </div>

                    {filteredResults.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredResults.slice(0, 10).map((announcement) => (
                          <SearchCardClientAnnouncement
                            key={announcement.id}
                            announcement={announcement}
                            onSeeMore={handleAnnouncementSelect}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "list" && filteredResults.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResults.map((announcement) => (
                      <SearchCardClientAnnouncement
                        key={announcement.id}
                        announcement={announcement}
                        onSeeMore={handleAnnouncementSelect}
                      />
                    ))}
                  </div>
                )}

                {filteredResults.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune annonce trouvée</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Essayez de modifier vos critères de recherche ou cliquez sur "Voir toutes les annonces"
                    </p>
                    <button
                      onClick={handleFindAll}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Voir toutes les annonces
                    </button>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
