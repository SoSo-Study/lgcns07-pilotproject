"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileMenuProps = {
  children: ReactNode; // 서랍 안에 넣을 내용 (layout에서 <Sidebar />를 넘겨줘요)
};

// 폰 ☰ 버튼 + 왼쪽에서 나오는 서랍(Sheet)
// 열림/닫힘(open)을 기억해야 해서 "use client". 내용은 서버 부품을 children으로 받아요
export function MobileMenu({ children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // 서랍 안의 링크를 누르면 다른 화면으로 가면서 서랍도 닫기
  function closeOnLinkClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      setOpen(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="메뉴 열기" />}
      >
        <Menu aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 gap-0 p-0">
        <SheetTitle className="sr-only">메뉴</SheetTitle>
        {/* 링크는 키보드(Enter)로 눌러도 click이 일어나서 키보드로도 닫혀요 */}
        <div className="h-full" onClick={closeOnLinkClick}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
