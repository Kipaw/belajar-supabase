"use client";

import type { IMenu } from "@/types/menu";
import supabase from "@/lib/db";
import { useEffect, useState } from "react";

export default function Home() {
  const [menus, setMenus] = useState<IMenu[]>([]);

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

  return (
    <div>
      <div>Home</div>
      {menus.map((menu) => (
        <div key={menu.id}>{menu.name}</div>
      ))}
    </div>
  );
}
