
import { useEffect, useMemo, useRef, useState } from "react";

import {
  adminCreatePhone,
  adminDeletePhone,
  adminFetchBrands,
  adminFetchPhones,
  adminUpdatePhone,
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
  adminCreateImage,
  adminUpdateImage,
  adminDeleteImage,
  type AdminPhone,
  type AdminPhoneImage,
  type AdminPhoneVariant,
} from "../../api/admin";

import type { Brand } from "../../types";

const CONDITIONS = ["new", "used", "refurbished"] as const;

type Condition = (typeof CONDITIONS)[number];

interface PhoneVariantForm {
  id?: number;
  color: string;
  storage_gb: string;
  ram_gb: string;
  price: string;
  stock: string;
  sku: string;
}

interface ExistingImage {
  id: number;
  image: string;
  is_primary: boolean;
  order: number;
}

interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface PhoneForm extends Partial<AdminPhone> {
  name: string;
  brand: number;
  description: string;
  condition: Condition;
  screen_size: string;
  battery_mah: number | null;
  camera_mp: number | null;
  os: string;
  is_active: boolean;
}

const empty: PhoneForm = {
  name: "",
  brand: 0,
  description: "",
  condition: "new",
  screen_size: "",
  battery_mah: null,
  camera_mp: null,
  os: "",
  is_active: true,
};

const emptyVariant: PhoneVariantForm = {
  color: "",
  storage_gb: "",
  ram_gb: "",
  price: "",
  stock: "0",
  sku: "",
};

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: Record<string, unknown>;
    };
    message?: string;
  };

  const data = err?.response?.data;

  if (data) {
    if (typeof data.detail === "string") return data.detail;

    for (const value of Object.values(data)) {
      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return err?.message || "Something went wrong. Please try again.";
}

function mapVariantToForm(
  variant: AdminPhoneVariant
): PhoneVariantForm {
  return {
    id: variant.id,
    color: variant.color,
    storage_gb: String(variant.storage_gb),
    ram_gb:
      variant.ram_gb === null ? "" : String(variant.ram_gb),
    price: String(variant.price),
    stock: String(variant.stock),
    sku: variant.sku,
  };
}

function mapImageToForm(
  image: AdminPhoneImage
): ExistingImage {
  return {
    id: image.id,
    image: image.image,
    is_primary: image.is_primary,
    order: image.order,
  };
}

export function AdminProducts() {
  const [phones, setPhones] = useState<AdminPhone[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [editing, setEditing] = useState<PhoneForm | null>(null);

  const [variants, setVariants] = useState<PhoneVariantForm[]>([
    { ...emptyVariant },
  ]);

  const [deletedVariantIds, setDeletedVariantIds] = useState<number[]>([]);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<ImagePreview[]>([]);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalError, setModalError] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Keep track of preview URLs so they are revoked only when
  // the preview is removed or the modal is closed.
  const previewUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrlsRef.current.clear();
    };
  }, []);

  const reload = async () => {
    setLoading(true);
    setPageError("");

    try {
      const [phoneData, brandData] = await Promise.all([
        adminFetchPhones(),
        adminFetchBrands(),
      ]);

      setPhones(phoneData);
      setBrands(brandData);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const filteredPhones = useMemo(() => {
    return phones.filter((phone) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        phone.name.toLowerCase().includes(searchValue) ||
        phone.brand_name?.toLowerCase().includes(searchValue) ||
        String(phone.id).includes(searchValue);

      const matchesCondition =
        conditionFilter === "all" ||
        phone.condition === conditionFilter;

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && phone.is_active) ||
        (activeFilter === "inactive" && !phone.is_active);

      return matchesSearch && matchesCondition && matchesActive;
    });
  }, [phones, search, conditionFilter, activeFilter]);

  const activeCount = phones.filter((phone) => phone.is_active).length;
  const inactiveCount = phones.filter((phone) => !phone.is_active).length;
  const newCount = phones.filter((phone) => phone.condition === "new").length;

  // ============================================================
  // IMAGE PREVIEW MANAGEMENT
  // ============================================================

  const clearImagePreviews = () => {
    previewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewUrlsRef.current.clear();
    setNewImages([]);
  };

  const openCreate = () => {
    clearImagePreviews();

    setEditing({
      ...empty,
      brand: brands[0]?.id ?? 0,
    });

    setVariants([{ ...emptyVariant }]);
    setDeletedVariantIds([]);
    setExistingImages([]);
    setDeletedImageIds([]);

    setModalError("");
    setPageError("");
  };

  const openEdit = (phone: AdminPhone) => {
    clearImagePreviews();

    setEditing({
      id: phone.id,
      slug: phone.slug,
      name: phone.name,
      brand: phone.brand,
      description: phone.description ?? "",
      condition: (phone.condition as Condition) ?? "new",
      screen_size: phone.screen_size ?? "",
      battery_mah: phone.battery_mah ?? null,
      camera_mp: phone.camera_mp ?? null,
      os: phone.os ?? "",
      is_active: phone.is_active,
    });

    // The admin phone serializer already returns nested variants
    // and images, so use those instead of starting with empty data.
    const savedVariants = phone.variants ?? [];
    const savedImages = phone.images ?? [];

    setVariants(
      savedVariants.length > 0
        ? savedVariants.map(mapVariantToForm)
        : [{ ...emptyVariant }]
    );

    setExistingImages(savedImages.map(mapImageToForm));

    setDeletedVariantIds([]);
    setDeletedImageIds([]);
    setModalError("");
    setPageError("");
  };

  const closeModal = () => {
    if (saving) return;

    clearImagePreviews();
    setEditing(null);
    setVariants([{ ...emptyVariant }]);
    setExistingImages([]);
    setDeletedVariantIds([]);
    setDeletedImageIds([]);
    setModalError("");
  };

  const updateField = <K extends keyof PhoneForm>(
    field: K,
    value: PhoneForm[K]
  ) => {
    setEditing((previous) =>
      previous ? { ...previous, [field]: value } : previous
    );
  };

  // ============================================================
  // VARIANT MANAGEMENT
  // ============================================================

  const updateVariant = (
    index: number,
    field: keyof PhoneVariantForm,
    value: string
  ) => {
    setVariants((previous) =>
      previous.map((variant, currentIndex) =>
        currentIndex === index
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  const addVariant = () => {
    setVariants((previous) => [
      ...previous,
      { ...emptyVariant },
    ]);
  };

  const removeVariant = (index: number) => {
    const variant = variants[index];

    if (variant?.id) {
      setDeletedVariantIds((previous) => [
        ...previous,
        variant.id!,
      ]);
    }

    setVariants((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const validateVariants = (): string | null => {
    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index];

      const hasData =
        variant.color.trim() !== "" ||
        variant.storage_gb.trim() !== "" ||
        variant.ram_gb.trim() !== "" ||
        variant.price.trim() !== "" ||
        variant.sku.trim() !== "";

      // Ignore a completely empty new row.
      if (!hasData && !variant.id) continue;

      if (!variant.color.trim()) {
        return `Please enter a color for variant ${index + 1}.`;
      }

      if (
        !variant.storage_gb ||
        Number(variant.storage_gb) <= 0
      ) {
        return `Please enter a valid storage size for variant ${index + 1}.`;
      }

      if (
        !variant.price ||
        Number(variant.price) <= 0
      ) {
        return `Please enter a valid price for variant ${index + 1}.`;
      }

      if (!variant.sku.trim()) {
        return `Please enter a SKU for variant ${index + 1}.`;
      }

      if (
        variant.stock.trim() === "" ||
        Number(variant.stock) < 0
      ) {
        return `Please enter a valid stock quantity for variant ${index + 1}.`;
      }

      if (
        variant.ram_gb.trim() !== "" &&
        Number(variant.ram_gb) <= 0
      ) {
        return `Please enter a valid RAM size for variant ${index + 1}.`;
      }
    }

    return null;
  };

  // ============================================================
  // IMAGE MANAGEMENT
  // ============================================================

  const addImageFiles = (
    files: FileList | null,
    isPrimary: boolean
  ) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setModalError(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setModalError(`${file.name} exceeds the 5 MB image limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setModalError("");

    const additions = validFiles.map((file, index) => {
      const preview = URL.createObjectURL(file);
      previewUrlsRef.current.add(preview);

      return {
        file,
        preview,
        isPrimary: isPrimary && index === 0,
      };
    });

    if (isPrimary) {
      setExistingImages((previous) =>
        previous.map((image) => ({
          ...image,
          is_primary: false,
        }))
      );

      setNewImages((previous) => [
        ...previous.map((image) => ({
          ...image,
          isPrimary: false,
        })),
        ...additions,
      ]);
    } else {
      setNewImages((previous) => [
        ...previous,
        ...additions,
      ]);
    }
  };

  const setPrimaryNewImage = (index: number) => {
    setExistingImages((previous) =>
      previous.map((image) => ({
        ...image,
        is_primary: false,
      }))
    );

    setNewImages((previous) =>
      previous.map((image, currentIndex) => ({
        ...image,
        isPrimary: currentIndex === index,
      }))
    );
  };

  const setPrimaryExistingImage = (id: number) => {
    setNewImages((previous) =>
      previous.map((image) => ({
        ...image,
        isPrimary: false,
      }))
    );

    setExistingImages((previous) =>
      previous.map((image) => ({
        ...image,
        is_primary: image.id === id,
      }))
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((previous) => {
      const removed = previous[index];

      if (removed) {
        URL.revokeObjectURL(removed.preview);
        previewUrlsRef.current.delete(removed.preview);
      }

      const remaining = previous.filter(
        (_, currentIndex) => currentIndex !== index
      );

      // If the removed image was primary, select another image.
      if (removed?.isPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
      }

      return remaining;
    });

    setExistingImages((previous) => {
      const hasPrimaryNewImage = newImages.some(
        (image, currentIndex) =>
          image.isPrimary && currentIndex !== index
      );

      if (hasPrimaryNewImage) return previous;

      const hasAnotherNewImage =
        newImages.length > 1 && newImages.some(
          (_, currentIndex) => currentIndex !== index
        );

      if (hasAnotherNewImage) return previous;

      if (previous.length > 0 && !previous.some((image) => image.is_primary)) {
        return previous.map((image, currentIndex) => ({
          ...image,
          is_primary: currentIndex === 0,
        }));
      }

      return previous;
    });
  };

  const removeExistingImage = (id: number) => {
    const removed = existingImages.find((image) => image.id === id);

    setDeletedImageIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );

    setExistingImages((previous) => {
      const remaining = previous.filter((image) => image.id !== id);

      if (removed?.is_primary && remaining.length > 0) {
        remaining[0].is_primary = true;
      }

      return remaining;
    });

    if (removed?.is_primary && newImages.length > 0) {
      setNewImages((previous) =>
        previous.map((image, index) => ({
          ...image,
          isPrimary: index === 0,
        }))
      );
    }
  };

  // ============================================================
  // SAVE PHONE, VARIANTS, AND IMAGES
  // ============================================================

  const saveVariants = async (phoneId: number) => {
    // Delete variants removed from the form.
    for (const variantId of deletedVariantIds) {
      await adminDeleteVariant(variantId);
    }

    for (const variant of variants) {
      const hasData =
        variant.color.trim() !== "" ||
        variant.storage_gb.trim() !== "" ||
        variant.ram_gb.trim() !== "" ||
        variant.price.trim() !== "" ||
        variant.sku.trim() !== "";

      if (!hasData && !variant.id) continue;

      const payload = {
        phone: phoneId,
        color: variant.color.trim(),
        storage_gb: Number(variant.storage_gb),
        ram_gb:
          variant.ram_gb.trim() === ""
            ? null
            : Number(variant.ram_gb),
        price: variant.price,
        stock: Number(variant.stock || 0),
        sku: variant.sku.trim(),
      };

      if (variant.id) {
        await adminUpdateVariant(variant.id, payload);
      } else {
        await adminCreateVariant(payload);
      }
    }
  };

  const saveImages = async (phoneId: number) => {
    // First delete images that the user removed.
    for (const imageId of deletedImageIds) {
      await adminDeleteImage(imageId);
    }

    // Clear primary status on all remaining existing images.
    // This prevents multiple primary images when selecting a new one.
    for (const image of existingImages) {
      await adminUpdateImage(image.id, {
        is_primary: false,
        order: image.order,
      });
    }

    // Upload new images as non-primary first.
    const uploadedImages: {
      preview: string;
      id: number;
    }[] = [];

    for (let index = 0; index < newImages.length; index++) {
      const image = newImages[index];

      const uploaded = await adminCreateImage({
        phone: phoneId,
        image: image.file,
        is_primary: false,
        order: existingImages.length + index,
      });

      uploadedImages.push({
        preview: image.preview,
        id: uploaded.id,
      });
    }

    // Restore the selected existing primary image, if any.
    const selectedExistingPrimary = existingImages.find(
      (image) => image.is_primary
    );

    if (selectedExistingPrimary) {
      await adminUpdateImage(selectedExistingPrimary.id, {
        is_primary: true,
      });
    }

    // Or set the uploaded image as primary.
    const selectedNewPrimary = newImages.find(
      (image) => image.isPrimary
    );

    if (selectedNewPrimary) {
      const uploadedPrimary = uploadedImages.find(
        (image) => image.preview === selectedNewPrimary.preview
      );

      if (uploadedPrimary) {
        await adminUpdateImage(uploadedPrimary.id, {
          is_primary: true,
        });
      }
    }
  };

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editing) return;

    setSaving(true);
    setModalError("");
    setPageError("");
    setSuccess("");

    try {
      if (!editing.name.trim()) {
        throw new Error("Phone name is required.");
      }

      if (!editing.brand) {
        throw new Error("Please select a brand.");
      }

      const variantError = validateVariants();

      if (variantError) {
        throw new Error(variantError);
      }

      const payload = {
        name: editing.name.trim(),
        brand: Number(editing.brand),
        description: editing.description ?? "",
        condition: editing.condition,
        screen_size: editing.screen_size || null,
        battery_mah: editing.battery_mah ?? null,
        camera_mp: editing.camera_mp ?? null,
        os: editing.os ?? "",
        is_active: editing.is_active ?? true,
      };

      // Save the main phone record first.
      const savedPhone =
        editing.id
          ? await adminUpdatePhone(editing.id, payload)
          : await adminCreatePhone(payload);

      // Then save its variants and images using the returned ID.
      await saveVariants(savedPhone.id);
      await saveImages(savedPhone.id);

      setSuccess(
        editing.id
          ? "Phone, variants, and images updated successfully."
          : "Phone, variants, and images created successfully."
      );

      clearImagePreviews();
      setEditing(null);

      await reload();
    } catch (error) {
      setModalError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PHONE
  // ============================================================

  const handleDelete = async (phone: AdminPhone) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${phone.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(phone.id);
    setPageError("");
    setSuccess("");

    try {
      await adminDeletePhone(phone.id);

      setSuccess(`${phone.name} deleted successfully.`);

      await reload();
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // PAGE UI
  // ============================================================

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl sm:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              STORE MANAGEMENT
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Inventory Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75">
              Manage your smartphone catalog, product specifications,
              availability, variants, pricing, and product imagery.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <span className="text-xl">+</span>
            Add New Phone
          </button>
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <HeaderStat label="Total Products" value={phones.length} />
          <HeaderStat label="Active Products" value={activeCount} />
          <HeaderStat label="New Phones" value={newCount} />
        </div>
      </section>

      {/* NOTIFICATIONS */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <span className="text-lg">✓</span>
          <p>{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto font-bold"
          >
            ×
          </button>
        </div>
      )}

      {pageError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {pageError}

          <button
            type="button"
            onClick={() => void reload()}
            className="ml-3 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Inventory"
          value={phones.length}
          icon="📱"
          description="All registered phones"
        />

        <SummaryCard
          title="Active Products"
          value={activeCount}
          icon="✓"
          description="Visible in the store"
        />

        <SummaryCard
          title="Inactive Products"
          value={inactiveCount}
          icon="◌"
          description="Hidden from customers"
        />

        <SummaryCard
          title="New Condition"
          value={newCount}
          icon="✨"
          description="Brand-new phones"
        />
      </section>

      {/* INVENTORY TABLE */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and manage all phones in your store.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search phones..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={conditionFilter}
                onChange={(event) =>
                  setConditionFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All Conditions</option>

                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() +
                      condition.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={activeFilter}
                onChange={(event) =>
                  setActiveFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              📱
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No phones found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Brand</th>
                  <th className="px-6 py-4 font-bold">Condition</th>
                  <th className="px-6 py-4 font-bold">Specifications</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 text-right font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPhones.map((phone) => (
                  <tr
                    key={phone.id}
                    className="transition hover:bg-blue-50/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {phone.images?.find((image) => image.is_primary) ? (
                          <img
                            src={
                              phone.images.find(
                                (image) => image.is_primary
                              )!.image
                            }
                            alt={phone.name}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-2xl">
                            📱
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-slate-900">
                            {phone.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: #{phone.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {phone.brand_name || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <ConditionBadge condition={phone.condition} />
                    </td>

                    <td className="px-6 py-5 text-xs text-slate-500">
                      <div>
                        {phone.screen_size || "—"} inch display
                      </div>

                      <div className="mt-1">
                        {phone.battery_mah
                          ? `${phone.battery_mah} mAh`
                          : "Battery not set"}
                      </div>

                      <div className="mt-1">
                        {phone.variants?.length ?? 0} variant(s)
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                          phone.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            phone.is_active
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {phone.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(phone)}
                          className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === phone.id}
                          onClick={() => void handleDelete(phone)}
                          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === phone.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row">
          <span>
            Showing {filteredPhones.length} of {phones.length} products
          </span>

          <span>PhoneStore Inventory</span>
        </div>
      </section>

      {/* CREATE / EDIT MODAL */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-blue-950 px-6 py-5 text-white sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Product Management
                </p>

                <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                  {editing.id ? "Edit Phone" : "Add New Phone"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl transition hover:bg-white/20 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={submit} className="space-y-7 p-5 sm:p-8">
              {modalError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {modalError}
                </div>
              )}

              {/* BASIC INFORMATION */}
              <FormSection
                number="01"
                title="Basic Information"
                description="Enter the phone's identity and store details."
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="Phone Name" required>
                    <input
                      required
                      value={editing.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="e.g. iPhone 15 Pro"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Brand" required>
                    <select
                      required
                      value={editing.brand || ""}
                      onChange={(event) =>
                        updateField("brand", Number(event.target.value))
                      }
                      className="form-input"
                    >
                      <option value="">Select brand</option>

                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Condition" required>
                    <select
                      value={editing.condition}
                      onChange={(event) =>
                        updateField(
                          "condition",
                          event.target.value as Condition
                        )
                      }
                      className="form-input"
                    >
                      {CONDITIONS.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition.charAt(0).toUpperCase() +
                            condition.slice(1)}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Operating System">
                    <input
                      value={editing.os ?? ""}
                      onChange={(event) =>
                        updateField("os", event.target.value)
                      }
                      placeholder="e.g. Android 15"
                      className="form-input"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Description">
                      <textarea
                        rows={4}
                        value={editing.description ?? ""}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        placeholder="Describe this phone..."
                        className="form-input resize-y"
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* SPECIFICATIONS */}
              <FormSection
                number="02"
                title="Technical Specifications"
                description="Add the main technical information customers need."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Screen Size (inches)">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editing.screen_size ?? ""}
                      onChange={(event) =>
                        updateField("screen_size", event.target.value)
                      }
                      placeholder="6.70"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Battery Capacity (mAh)">
                    <input
                      type="number"
                      min="0"
                      value={editing.battery_mah ?? ""}
                      onChange={(event) =>
                        updateField(
                          "battery_mah",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                      placeholder="5000"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Camera (MP)">
                    <input
                      type="number"
                      min="0"
                      value={editing.camera_mp ?? ""}
                      onChange={(event) =>
                        updateField(
                          "camera_mp",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                      placeholder="108"
                      className="form-input"
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* VARIANTS AND PRICING */}
              <FormSection
                number="03"
                title="Variants and Pricing"
                description="Set the price and stock for each phone configuration."
              >
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div
                      key={variant.id ?? `new-${index}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800">
                            Variant {index + 1}
                          </h4>

                          {variant.id && (
                            <p className="mt-1 text-xs text-slate-400">
                              Saved variant #{variant.id}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-xs font-bold text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <FormField label="Color" required>
                          <input
                            value={variant.color}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "color",
                                event.target.value
                              )
                            }
                            placeholder="Titanium Black"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Storage (GB)" required>
                          <input
                            type="number"
                            min="1"
                            value={variant.storage_gb}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "storage_gb",
                                event.target.value
                              )
                            }
                            placeholder="256"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="RAM (GB)">
                          <input
                            type="number"
                            min="1"
                            value={variant.ram_gb}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "ram_gb",
                                event.target.value
                              )
                            }
                            placeholder="8"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Price" required>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "price",
                                event.target.value
                              )
                            }
                            placeholder="45000"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Stock Quantity" required>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "stock",
                                event.target.value
                              )
                            }
                            placeholder="10"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="SKU" required>
                          <input
                            value={variant.sku}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "sku",
                                event.target.value
                              )
                            }
                            placeholder="IPH15P-256-BLK"
                            className="form-input"
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className="rounded-xl border border-dashed border-blue-300 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    + Add Another Variant
                  </button>

                  <p className="text-xs leading-5 text-slate-500">
                    Each variant has its own color, storage, RAM,
                    price, stock quantity, and SKU.
                  </p>
                </div>
              </FormSection>

              {/* PRODUCT IMAGES */}
              <FormSection
                number="04"
                title="Product Images"
                description="Upload a main product image and additional gallery images."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-100"
                  >
                    <div className="text-3xl">🖼️</div>

                    <p className="mt-2 font-bold text-blue-900">
                      Upload Main Image
                    </p>

                    <p className="mt-1 text-xs text-blue-700">
                      Select the primary product image
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-slate-500 hover:bg-slate-100"
                  >
                    <div className="text-3xl">📸</div>

                    <p className="mt-2 font-bold text-slate-800">
                      Upload Gallery Images
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Select multiple additional images
                    </p>
                  </button>
                </div>

                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    addImageFiles(event.target.files, true);
                    event.target.value = "";
                  }}
                />

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    addImageFiles(event.target.files, false);
                    event.target.value = "";
                  }}
                />

                {/* EXISTING IMAGES */}
                {existingImages.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">
                        Saved Images ({existingImages.length})
                      </h4>

                      <span className="text-xs text-slate-500">
                        Already uploaded
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.id}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <img
                            src={image.image}
                            alt="Existing product"
                            className="h-36 w-full object-cover"
                          />

                          <div className="space-y-2 p-2">
                            {image.is_primary ? (
                              <span className="block rounded-lg bg-blue-100 px-2 py-1 text-center text-xs font-bold text-blue-700">
                                Main Image
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setPrimaryExistingImage(image.id)
                                }
                                className="w-full rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                              >
                                Set as Main
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removeExistingImage(image.id)
                              }
                              className="w-full rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NEW IMAGE PREVIEWS */}
                {newImages.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">
                        New Images ({newImages.length})
                      </h4>

                      <span className="text-xs text-slate-500">
                        Maximum 5 MB per image
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {newImages.map((image, index) => (
                        <div
                          key={image.preview}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <img
                            src={image.preview}
                            alt={`Product preview ${index + 1}`}
                            className="h-36 w-full object-cover"
                          />

                          <div className="space-y-2 p-2">
                            {image.isPrimary ? (
                              <span className="block rounded-lg bg-blue-100 px-2 py-1 text-center text-xs font-bold text-blue-700">
                                Main Image
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setPrimaryNewImage(index)
                                }
                                className="w-full rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                              >
                                Set as Main
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="w-full rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Supported image formats depend on your server configuration.
                  Each selected image must be 5 MB or smaller.
                </p>
              </FormSection>

              {/* STORE VISIBILITY */}
              <FormSection
                number="05"
                title="Store Visibility"
                description="Choose whether customers can see this phone."
              >
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      Make product active
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Active products are available to customers in the store.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(event) =>
                      updateField("is_active", event.target.checked)
                    }
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>
              </FormSection>

              {/* FORM ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing.id
                      ? "Save Changes"
                      : "Create Phone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          padding: 11px 13px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: all 150ms ease;
        }

        .form-input:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs font-medium text-blue-100/70">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-700">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function ConditionBadge({
  condition,
}: {
  condition: string;
}) {
  const styles: Record<string, string> = {
    new: "bg-emerald-50 text-emerald-700",
    used: "bg-amber-50 text-amber-700",
    refurbished: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[condition] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {condition.charAt(0).toUpperCase() + condition.slice(1)}
    </span>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-700">
          {number}
        </div>

        <div>
          <h3 className="font-extrabold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      {children}
    </label>
  );
}
