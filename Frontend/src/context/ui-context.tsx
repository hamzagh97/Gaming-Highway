"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { createStrictContext } from "@/lib/create-strict-context";

export type ModalName =
  | "login"
  | "cart"
  | "wishlist"
  | "menu"
  | "quick-view"
  | "order-success";

type SimpleModalName = Exclude<ModalName, "quick-view" | "order-success">;

interface UIState {
  modal: ModalName | null;
  quickViewProductId: string | null;
  orderNumber: string | null;
}

interface UIContextValue extends UIState {
  openModal: (name: SimpleModalName) => void;
  openQuickView: (productId: string) => void;
  openOrderSuccess: (orderNumber: string) => void;
  closeModal: () => void;
}

const INITIAL_STATE: UIState = {
  modal: null,
  quickViewProductId: null,
  orderNumber: null,
};

const [UIContextProvider, useUI] = createStrictContext<UIContextValue>("UI");

export { useUI };

/** Only one overlay is open at a time; this provider owns which one. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(INITIAL_STATE);

  const openModal = useCallback(
    (name: SimpleModalName) => setState({ ...INITIAL_STATE, modal: name }),
    [],
  );
  const openQuickView = useCallback(
    (productId: string) =>
      setState({
        ...INITIAL_STATE,
        modal: "quick-view",
        quickViewProductId: productId,
      }),
    [],
  );
  const openOrderSuccess = useCallback(
    (orderNumber: string) =>
      setState({ ...INITIAL_STATE, modal: "order-success", orderNumber }),
    [],
  );
  const closeModal = useCallback(() => setState(INITIAL_STATE), []);

  const value = useMemo(
    () => ({
      ...state,
      openModal,
      openQuickView,
      openOrderSuccess,
      closeModal,
    }),
    [state, openModal, openQuickView, openOrderSuccess, closeModal],
  );

  return <UIContextProvider value={value}>{children}</UIContextProvider>;
}
