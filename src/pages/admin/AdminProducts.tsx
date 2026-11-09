import { useEffect, useState } from "react";
import {
  adminCreatePhone, adminDeletePhone, adminFetchBrands, adminFetchPhones, adminUpdatePhone,
  type AdminPhone,
} from "../../api/admin";
import type { Brand } from "../../types";

const CONDITIONS = ["new", "used", "refurbished"];

const empty = {
  name: "", brand: 0, description: "", condition: "new",
  screen_size: "", battery_mah: "", camera_mp: "", os: "", is_active: true,
};

export function AdminProducts() {
  const [phones, setPhones] = useState<AdminPhone[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Partial<AdminPhone> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reload = () => {
    adminFetchPhones().then(setPhones).catch(() => {});
    adminFetchBrands().then(setBrands).catch(() => {});
  };

  useEffect(reload, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: editing.name,
        brand: Number(editing.brand),
        description: editing.description ?? "",
        condition: editing.condition,
        screen_size: editing.screen_size || null,
        battery_mah: editing.battery_mah ? Number(editing.battery_mah) : null,
        camera_mp: editing.camera_mp ? Number(editing.camera_mp) : null,
        os: editing.os ?? "",
        is_active: editing.is_active ?? true,
      };
      if (editing.id) await adminUpdatePhone(editing.id, payload);
      else await adminCreatePhone(payload);
      setEditing(null);
      reload();
    } catch (err: any) {
      setError(JSON.stringify(err?.response?.data ?? "Error"));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await adminDeletePhone(id);
    reload();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="btn-primary" onClick={() => setEditing({ ...empty, brand: brands[0]?.id ?? 0 })}>
          + New phone
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Brand</th>
              <th className="p-3">Condition</th><th className="p-3">Active</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {phones.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.brand_name}</td>
                <td className="p-3 capitalize">{p.condition}</td>
                <td className="p-3">{p.is_active ? "✅" : "❌"}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="text-brand-600 hover:underline text-xs" onClick={() => setEditing(p)}>Edit</button>
                  <button className="text-red-600 hover:underline text-xs" onClick={() => del(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {phones.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={5}>No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">
            <h2 className="text-lg font-bold">{editing.id ? "Edit phone" : "New phone"}</h2>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div>
              <label className="label">Name</label>
              <input required className="input" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Brand</label>
              <select required className="input" value={editing.brand ?? 0} onChange={(e) => setEditing({ ...editing, brand: Number(e.target.value) })}>
                <option value={0} disabled>Select brand…</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Condition</label>
              <select className="input" value={editing.condition ?? "new"} onChange={(e) => setEditing({ ...editing, condition: e.target.value })}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={3} className="input" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Screen (")</label>
                <input type="number" step="0.01" className="input" value={editing.screen_size ?? ""} onChange={(e) => setEditing({ ...editing, screen_size: e.target.value })} />
              </div>
              <div>
                <label className="label">Battery (mAh)</label>
                <input type="number" className="input" value={editing.battery_mah ?? ""} onChange={(e) => setEditing({ ...editing, battery_mah: Number(e.target.value) || "" })} />
              </div>
              <div>
                <label className="label">Camera (MP)</label>
                <input type="number" className="input" value={editing.camera_mp ?? ""} onChange={(e) => setEditing({ ...editing, camera_mp: Number(e.target.value) || "" })} />
              </div>
              <div>
                <label className="label">OS</label>
                <input className="input" value={editing.os ?? ""} onChange={(e) => setEditing({ ...editing, os: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
              Active (visible in store)
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}