"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  getMenuApi,
  createMenuApi,
  updateMenuApi,
  deleteMenuApi,
} from "@/lib/menu";
import { MenuItem } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

const BLANK = { name: "", price: "", category: "", isAvailable: true };

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const fetchMenu = useCallback(async () => {
    try {
      const res = await getMenuApi();
      if (res.success && res.data) setItems(res.data);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const openCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setShowModal(true);
  };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category,
      isAvailable: item.isAvailable,
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(BLANK);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      toast.error("All fields are required");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("Enter a valid price");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateMenuApi(editing.id, {
          name: form.name,
          price,
          category: form.category,
          isAvailable: form.isAvailable,
        });
        if (res.success && res.data) {
          setItems((prev) =>
            prev.map((i) => (i.id === editing.id ? res.data! : i)),
          );
          toast.success("Menu item updated");
        }
      } else {
        const res = await createMenuApi({
          name: form.name,
          price,
          category: form.category,
          isAvailable: form.isAvailable,
        });
        if (res.success && res.data) {
          setItems((prev) => [...prev, res.data!]);
          toast.success("Menu item created");
        }
      }
      closeModal();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    setDeletingId(id);
    try {
      await deleteMenuApi(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Menu item deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const filtered =
    filterCat === "All" ? items : items.filter((i) => i.category === filterCat);

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    color: "var(--color-text-muted)",
    marginBottom: "7px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "6px",
            }}
          >
            Menu Management
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
            {items.length} items total
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Add Item
        </button>
      </div>

      {/* Category filter */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1px solid",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                filterCat === cat ? "var(--color-accent)" : "transparent",
              color:
                filterCat === cat
                  ? "var(--color-ink)"
                  : "var(--color-text-muted)",
              borderColor:
                filterCat === cat
                  ? "var(--color-accent)"
                  : "var(--color-border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🍽"
          title="No menu items"
          description="Add your first item to get started."
        />
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background: "var(--color-surface-high)",
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--color-accent)",
                    }}
                  >
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge ${item.isAvailable ? "badge-available" : "badge-unavailable"}`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn-ghost"
                        onClick={() => openEdit(item)}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <span
                            className="spinner"
                            style={{ width: "14px", height: "14px" }}
                          />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="card animate-fade-up"
            style={{ width: "100%", maxWidth: "440px", padding: "32px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "20px",
                marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}
            >
              {editing ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. Masala Dosa"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="e.g. Breakfast"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isAvailable: e.target.checked }))
                  }
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "var(--color-accent)",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="isAvailable"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Available for ordering
                </label>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={closeModal}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner"
                        style={{
                          width: "14px",
                          height: "14px",
                          borderWidth: "2px",
                        }}
                      />{" "}
                      Saving…
                    </>
                  ) : editing ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
