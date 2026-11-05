"use client";

import { Button } from "@/components/ui/button";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<IMenu | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }
      setMenu(data);
    };

    fetchMenu();
  }, [id]);

  if (!menu) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-16">
        <div className="w-1/2">
          <Image
            src={menu.image}
            alt={menu.name}
            width={360}
            height={1080}
            className="w-full h-[70vh] object-cover rounded-2xl"
          />
        </div>
        <div className="w-1/2 flex flex-col gap-4 ">
          <h1 className="text-3xl font-bold">{menu.name}</h1>
          <p className="text-muted-foreground">{menu.description}</p>
          <div className="flex gap-4">
            <p className="text-2xl font-semibold">${menu.price}.00</p>
            <Button className="w-fit px-2 py-2">Buy now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
