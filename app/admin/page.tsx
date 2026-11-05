"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddMenuDialog from "./add-menu-dialog";
import EditMenuDialog from "./edit-menu-dialog";

const AdminPage = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<{
    menu: IMenu;
    action: "edit" | "delete";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("menus").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setMenus(data ?? []);
    };

    fetchMenus();
  }, []);

  const handleDelete = async () => {
    if (!selectedMenu) return;

    setIsDeleting(true);
    const { data, error } = await supabase
      .from("menus")
      .delete()
      .eq("id", selectedMenu.menu.id)
      .select();
    setIsDeleting(false);

    if (error) {
      console.error(error);
      return;
    }

    // kalau RLS nggak ngizinin delete, error-nya null tapi data kosong
    if (!data || data.length === 0) {
      console.error(
        "Nggak ada baris yang terhapus, cek policy RLS untuk delete",
      );
      return;
    }

    setMenus((prev) => prev.filter((m) => m.id !== selectedMenu.menu.id));
    setSelectedMenu(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 w-full flex justify-between">
        <div className="text-3xl font-bold">Menu</div>
        <AddMenuDialog
          onAdded={(menu) => setMenus((prev) => [...prev, menu])}
        />
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu: IMenu) => (
              <TableRow key={menu.id}>
                <TableCell>
                  <div className="flex items-center gap-3 w-full">
                    <Image
                      width={50}
                      height={50}
                      src={menu.image}
                      alt={menu.name}
                      className="aspect-square object-cover rounded-lg"
                    />
                    <span>{menu.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {menu.description.split(" ").slice(0, 5).join(" ") + "..."}
                </TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>${menu.price}.00</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Action</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectedMenu({ menu, action: "edit" })
                        }
                      >
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400"
                        onClick={() =>
                          setSelectedMenu({ menu, action: "delete" })
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditMenuDialog
        menu={selectedMenu?.action === "edit" ? selectedMenu.menu : null}
        onClose={() => setSelectedMenu(null)}
        onUpdated={(updated) =>
          setMenus((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
          )
        }
      />
      <AlertDialog
        open={selectedMenu?.action === "delete"}
        onOpenChange={(open) => {
          if (!open) setSelectedMenu(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              Menu &quot;{selectedMenu?.menu.name}&quot; akan dihapus permanen
              dan nggak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // biar dialog nggak nutup sebelum delete selesai
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
