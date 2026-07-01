"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/checkout/cart-store";

export function AddToCartButton({ item, buyNow }: { item: CartItem; buyNow?: boolean }) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.bookId === item.bookId);

  function handleAdd() {
    addItem(item);
    setJustAdded(true);
    toast.success(`${item.title} added to cart`);
    if (buyNow) {
      router.push("/checkout");
    } else {
      setTimeout(() => setJustAdded(false), 1500);
    }
  }

  return (
    <Button variant={buyNow ? "gold" : "outline"} size="lg" onClick={handleAdd} disabled={!buyNow && inCart}>
      {inCart && !buyNow ? (
        <>
          <Check className="h-4 w-4" /> In cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> {buyNow ? "Buy now" : justAdded ? "Added!" : "Add to cart"}
        </>
      )}
    </Button>
  );
}
