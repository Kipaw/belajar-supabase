"use client";

import type { IMenu } from "@/types/menu";
import supabase from "@/lib/db";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4"> Menu </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {menus.map((menus: IMenu) => (
          <Card key={menus.id}>
            <CardContent>
              <Image
                src={menus.image}
                alt={menus.name}
                width={200}
                height={200}
                className="w-full h-[30vh] object-cover rounded-lg"
              ></Image>
              <div className="mt-4 flex justify-between">
                <div>
                  <h4 className="font-semibold text-xl">{menus.name}</h4>
                  <p>{menus.category}</p>
                </div>
                <p className="font-semibold text-2xl">${menus.price}.00</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold" size="lg">
                Detail Menu
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
