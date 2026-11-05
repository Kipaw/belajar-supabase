"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { useState } from "react";

type Props = {
  menu: IMenu | null;
  onClose: () => void;
  onUpdated: (menu: IMenu) => void;
};

const EditMenuDialog = ({ menu, onClose, onUpdated }: Props) => {
  return (
    <Dialog open={!!menu} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {/* key bikin form di-reset tiap ganti menu yang diedit */}
        {menu && (
          <EditForm
            key={menu.id}
            menu={menu}
            onClose={onClose}
            onUpdated={onUpdated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const EditForm = ({
  menu,
  onClose,
  onUpdated,
}: {
  menu: IMenu;
  onClose: () => void;
  onUpdated: (menu: IMenu) => void;
}) => {
  const [form, setForm] = useState({
    name: menu.name,
    description: menu.description,
    category: menu.category,
    price: String(menu.price),
    image: menu.image,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSaving(true);

    const { data, error } = await supabase
      .from("menus")
      .update({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        image: form.image,
      })
      .eq("id", menu.id)
      .select();

    setIsSaving(false);

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      return;
    }

    // kalau RLS nggak ngizinin update, error null tapi data kosong
    if (!data || data.length === 0) {
      setErrorMsg("Nggak ada data yang berubah, cek policy RLS untuk update.");
      return;
    }

    onUpdated(data[0] as IMenu);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Edit Menu</DialogTitle>
        <DialogDescription>Ubah data menu lalu simpan.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-category">Category</Label>
        <Input
          id="edit-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-price">Price</Label>
        <Input
          id="edit-price"
          name="price"
          type="number"
          min={0}
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-image">Image URL</Label>
        <Input
          id="edit-image"
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
          required
        />
      </div>

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditMenuDialog;
