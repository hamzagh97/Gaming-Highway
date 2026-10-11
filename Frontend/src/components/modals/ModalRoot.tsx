"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LoginModal } from "./LoginModal";
import { OrderSuccessModal } from "./OrderSuccessModal";
import { QuickViewModal } from "./QuickViewModal";
import { WishlistDrawer } from "./WishlistDrawer";

/** Mounts every global overlay once; each decides for itself whether it is open. */
export function ModalRoot() {
  return (
    <>
      <CartDrawer />
      <WishlistDrawer />
      <MobileMenu />
      <LoginModal />
      <QuickViewModal />
      <OrderSuccessModal />
    </>
  );
}
